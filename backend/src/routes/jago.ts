// ============================================================
// JAGO AI SCHOLARSHIP ASSISTANT ROUTES
// ============================================================
// JAGO uses a deterministic tool-based architecture.
// It fetches real data from backend services to answer
// student queries. It NEVER invents scholarship status.
// ============================================================

import { Router, Request, Response } from 'express';
import {
  getStudentProfile, getStudentApplications, getApplicationById,
  getApplicationTimeline, getStudentDocuments, getVerificationByApplication,
  getStudentPayments, getSchemeStatusForStudent, schemes, getSchemeById
} from '../data/mockDatabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

interface JagoTool {
  name: string;
  execute: (userId: string, params?: any) => any;
}

// JAGO's tool registry
const jagoTools: Record<string, JagoTool> = {
  getStudentProfile: {
    name: 'getStudentProfile',
    execute: (userId: string) => getStudentProfile(userId)
  },
  getScholarshipEligibility: {
    name: 'getScholarshipEligibility',
    execute: (userId: string) => {
      const profile = getStudentProfile(userId);
      if (!profile) return null;
      return schemes.map(s => ({
        scheme: s.shortName,
        eligible: s.eligibility.educationLevels.includes(profile.courseLevel) && profile.familyIncome <= s.eligibility.maxIncome,
        reason: s.eligibility.educationLevels.includes(profile.courseLevel)
          ? (profile.familyIncome <= s.eligibility.maxIncome ? 'Potentially eligible' : 'Income exceeds limit')
          : 'Education level not matching'
      }));
    }
  },
  getApplications: {
    name: 'getApplications',
    execute: (userId: string) => getStudentApplications(userId)
  },
  getApplicationStatus: {
    name: 'getApplicationStatus',
    execute: (userId: string, params: { applicationId: string }) => {
      const app = getApplicationById(params.applicationId);
      if (app) {
        const timeline = getApplicationTimeline(params.applicationId);
        return { application: app, timeline };
      }
      return null;
    }
  },
  getMissingDocuments: {
    name: 'getMissingDocuments',
    execute: (userId: string) => {
      const docs = getStudentDocuments(userId);
      return docs.filter(d => d.status === 'missing' || d.status === 'pending' || d.status === 'needs_review');
    }
  },
  getVerificationStatus: {
    name: 'getVerificationStatus',
    execute: (userId: string) => {
      const apps = getStudentApplications(userId);
      const verifications: any[] = [];
      apps.forEach(a => {
        const v = getVerificationByApplication(a.id);
        verifications.push({ applicationId: a.id, schemeName: a.schemeName, verifications: v });
      });
      return verifications;
    }
  },
  getPaymentStatus: {
    name: 'getPaymentStatus',
    execute: (userId: string) => getStudentPayments(userId)
  },
  getExistingBenefits: {
    name: 'getExistingBenefits',
    execute: (userId: string) => {
      const apps = getStudentApplications(userId);
      return apps.filter(a => ['approved', 'sanctioned', 'disbursed', 'payment_processing'].includes(a.status));
    }
  },
  getSchemeInformation: {
    name: 'getSchemeInformation',
    execute: (_userId: string, params: { schemeId: string }) => getSchemeById(params.schemeId)
  }
};

// Intent detection
function detectIntent(message: string): { intent: string; params: Record<string, any> } {
  const msg = message.toLowerCase();

  if (msg.includes('eligible') || msg.includes('eligibility') || msg.includes('can i apply') || msg.includes('qualify')) {
    const scheme = detectScheme(msg);
    return { intent: 'check_eligibility', params: { scheme } };
  }
  if (msg.includes('where is my') || msg.includes('status') || msg.includes('track') || msg.includes('application')) {
    return { intent: 'application_status', params: {} };
  }
  if (msg.includes('document') || msg.includes('missing') || msg.includes('upload')) {
    return { intent: 'missing_documents', params: {} };
  }
  if (msg.includes('payment') || msg.includes('money') || msg.includes('receive') || msg.includes('disburs') || msg.includes('amount')) {
    return { intent: 'payment_status', params: {} };
  }
  if (msg.includes('pending') || msg.includes('why') || msg.includes('stuck') || msg.includes('delay')) {
    return { intent: 'why_pending', params: {} };
  }
  if (msg.includes('benefit') || msg.includes('currently receiving') || msg.includes('existing')) {
    return { intent: 'existing_benefits', params: {} };
  }
  if (msg.includes('what should') || msg.includes('next step') || msg.includes('do next') || msg.includes('help')) {
    return { intent: 'next_steps', params: {} };
  }
  if (msg.includes('scheme') || msg.includes('scholarship') || msg.includes('about')) {
    const scheme = detectScheme(msg);
    return { intent: 'scheme_info', params: { scheme } };
  }
  if (msg.includes('verification') || msg.includes('verify')) {
    return { intent: 'verification_status', params: {} };
  }

  return { intent: 'general', params: {} };
}

function detectScheme(msg: string): string | null {
  if (msg.includes('pre-matric') || msg.includes('pre matric') || msg.includes('prematric')) return 'SCH001';
  if (msg.includes('post-matric') || msg.includes('post matric') || msg.includes('postmatric')) return 'SCH002';
  if (msg.includes('top class') || msg.includes('topclass')) return 'SCH003';
  if (msg.includes('nfst') || msg.includes('fellowship')) return 'SCH004';
  if (msg.includes('nos') || msg.includes('overseas')) return 'SCH005';
  return null;
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'submitted': 'Submitted',
    'under_verification': 'Under Verification',
    'institution_verified': 'Institution Verified',
    'state_verified': 'State Verified',
    'mota_review': 'Under MoTA Review',
    'approved': 'Approved',
    'sanctioned': 'Sanctioned',
    'payment_processing': 'Payment Processing',
    'disbursed': 'Disbursed',
    'rejected': 'Rejected',
    'action_required': 'Action Required'
  };
  return statusMap[status] || status;
}

// Generate response based on intent and data
function generateResponse(intent: string, userId: string, params: Record<string, any>): string {
  switch (intent) {
    case 'check_eligibility': {
      const eligibility = jagoTools.getScholarshipEligibility.execute(userId);
      if (!eligibility) return "I couldn't find your profile. Please complete your profile first.";
      
      if (params.scheme) {
        const schemeElig = eligibility.find((e: any) => {
          const scheme = getSchemeById(params.scheme);
          return scheme && e.scheme === scheme.shortName;
        });
        if (schemeElig) {
          return schemeElig.eligible
            ? `Based on your profile, you appear to be **potentially eligible** for the ${schemeElig.scheme} Scholarship. Your education level and income criteria match the requirements. Would you like to start an application?\n\n⚠️ *This is a preliminary assessment. Final eligibility is determined by the official verification process.*`
            : `Based on your current profile, you may **not be eligible** for the ${schemeElig.scheme} Scholarship. Reason: ${schemeElig.reason}. Please check the eligibility criteria or contact support for guidance.`;
        }
      }

      const eligible = eligibility.filter((e: any) => e.eligible);
      if (eligible.length > 0) {
        return `Based on your profile, you may be **potentially eligible** for: ${eligible.map((e: any) => e.scheme).join(', ')}.\n\nWould you like to check detailed eligibility for any specific scheme?\n\n⚠️ *Preliminary assessment. Final eligibility subject to official verification.*`;
      }
      return "Based on your current profile, I couldn't find matching schemes. Please make sure your profile is complete and accurate.";
    }

    case 'application_status': {
      const apps = jagoTools.getApplications.execute(userId);
      if (!apps || apps.length === 0) return "You don't have any applications yet. Would you like to check your eligibility and start one?";
      
      const statusLines = apps.map((a: any) => {
        const timeline = getApplicationTimeline(a.id);
        const currentStep = timeline.find((t: any) => t.current);
        return `📋 **${a.schemeName}** (${a.id})\n   Status: **${formatStatus(a.status)}**${currentStep ? `\n   Current Step: ${currentStep.label}` : ''}\n   Last Updated: ${new Date(a.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      });

      return `Here are your applications:\n\n${statusLines.join('\n\n')}\n\nWould you like more details about any specific application?`;
    }

    case 'missing_documents': {
      const missing = jagoTools.getMissingDocuments.execute(userId);
      if (!missing || missing.length === 0) return "All your documents are in order. No missing or pending documents found. ✅";
      
      const docList = missing.map((d: any) => `• **${d.name}** — Status: ${d.status}`).join('\n');
      return `The following documents need your attention:\n\n${docList}\n\nPlease upload or update these documents in your Document Wallet to avoid delays in your application.`;
    }

    case 'payment_status': {
      const payments = jagoTools.getPaymentStatus.execute(userId);
      if (!payments || payments.length === 0) return "No payment information is available for your applications yet. Payments are processed after applications are sanctioned.";
      
      const paymentLines = payments.map((p: any) => {
        return `💰 **${p.schemeName}**\n   Sanction Amount: ₹${p.sanctionAmount.toLocaleString()}\n   Status: **${formatStatus(p.status)}**\n   Transaction ID: ${p.transactionId}${p.paymentDate ? `\n   Payment Date: ${new Date(p.paymentDate).toLocaleDateString('en-IN')}` : ''}`;
      });
      return `Here's your payment information:\n\n${paymentLines.join('\n\n')}\n\n⚠️ *Payment information shown is from the system records. For official confirmation, check your bank statement.*`;
    }

    case 'why_pending': {
      const apps = jagoTools.getApplications.execute(userId);
      if (!apps || apps.length === 0) return "You don't have any pending applications.";
      
      const pendingApps = apps.filter((a: any) => !['disbursed', 'rejected'].includes(a.status));
      if (pendingApps.length === 0) return "None of your applications are currently pending.";

      const explanations = pendingApps.map((a: any) => {
        const verifications = getVerificationByApplication(a.id);
        const pendingVerifications = verifications.filter((v: any) => v.status !== 'verified');
        const mismatches = verifications.filter((v: any) => v.status === 'mismatch');

        let reason = `**${a.schemeName}**: Currently at "${formatStatus(a.status)}" stage.`;
        if (mismatches.length > 0) {
          reason += ` There is a data mismatch in ${mismatches.map((m: any) => m.category).join(', ')} that requires manual review.`;
        } else if (pendingVerifications.length > 0) {
          reason += ` Verification is pending for: ${pendingVerifications.map((v: any) => v.category).join(', ')}.`;
        } else {
          reason += ' The application is progressing through the standard review process. No action is currently required from you.';
        }
        if (a.deficiencies.length > 0) {
          reason += ` Deficiencies noted: ${a.deficiencies.join(', ')}.`;
        }
        return reason;
      });

      return explanations.join('\n\n');
    }

    case 'existing_benefits': {
      const benefits = jagoTools.getExistingBenefits.execute(userId);
      if (!benefits || benefits.length === 0) return "You are not currently receiving any scholarship benefits through this system.";
      
      const benefitLines = benefits.map((b: any) => `• **${b.schemeName}** — Status: ${formatStatus(b.status)}, Academic Year: ${b.academicYear}`);
      return `Your current scholarship benefits:\n\n${benefitLines.join('\n')}\n\n📌 *Note: You can typically avail only one scholarship/fellowship at a time. Before applying for another scheme, ensure you understand the overlap rules.*`;
    }

    case 'next_steps': {
      const profile = jagoTools.getStudentProfile.execute(userId);
      const apps = jagoTools.getApplications.execute(userId);
      const missing = jagoTools.getMissingDocuments.execute(userId);
      
      const steps: string[] = [];
      
      if (profile && profile.profileCompletion < 100) {
        steps.push(`📝 **Complete your profile** — Currently ${profile.profileCompletion}% complete`);
      }
      if (missing && missing.length > 0) {
        steps.push(`📄 **Upload missing documents** — ${missing.length} document(s) need attention`);
      }
      
      const eligibility = jagoTools.getScholarshipEligibility.execute(userId);
      const eligibleSchemes = eligibility?.filter((e: any) => e.eligible) || [];
      const appliedSchemeIds = apps?.map((a: any) => a.schemeId) || [];
      const unappliedEligible = eligibleSchemes.filter((e: any) => {
        const scheme = schemes.find(s => s.shortName === e.scheme);
        return scheme && !appliedSchemeIds.includes(scheme.id);
      });
      
      if (unappliedEligible.length > 0) {
        steps.push(`🎓 **Apply for eligible schemes** — You may be eligible for: ${unappliedEligible.map((e: any) => e.scheme).join(', ')}`);
      }

      const actionApps = apps?.filter((a: any) => a.deficiencies.length > 0 || a.status === 'action_required') || [];
      if (actionApps.length > 0) {
        steps.push(`⚠️ **Resolve deficiencies** — ${actionApps.length} application(s) need your attention`);
      }

      if (steps.length === 0) {
        return "Everything looks good! Your applications are progressing normally. Keep checking back for updates, or ask me about any specific scholarship or application.";
      }

      return `Here's what you should do next:\n\n${steps.join('\n\n')}\n\nWould you like help with any of these?`;
    }

    case 'scheme_info': {
      if (params.scheme) {
        const scheme = getSchemeById(params.scheme);
        if (scheme) {
          return `**${scheme.name}**\n\n${scheme.detailedDescription}\n\n**Key Benefits:**\n${scheme.benefits.amounts.map(a => `• ${a.category}: ₹${a.amount.toLocaleString()}`).join('\n')}\n\n**Income Limit:** ₹${scheme.eligibility.maxIncome.toLocaleString()}\n\nWould you like to check your eligibility for this scheme?`;
        }
      }
      const schemeList = schemes.map(s => `• **${s.shortName}** — ${s.description}`).join('\n');
      return `Here are the 5 scholarship schemes available:\n\n${schemeList}\n\nAsk me about any specific scheme for detailed information.`;
    }

    case 'verification_status': {
      const verData = jagoTools.getVerificationStatus.execute(userId);
      if (!verData || verData.length === 0) return "No verification records found for your applications.";
      
      const verLines = verData.map((v: any) => {
        if (v.verifications.length === 0) return `**${v.schemeName}**: Verification pending`;
        const items = v.verifications.map((ve: any) => `  • ${ve.category} (${ve.source}): ${ve.status === 'verified' ? '✅ Verified' : ve.status === 'mismatch' ? '⚠️ Mismatch — Manual review required' : '⏳ Pending'}`);
        return `**${v.schemeName}**:\n${items.join('\n')}`;
      });
      return `Verification Status:\n\n${verLines.join('\n\n')}`;
    }

    default:
      return "I'm JAGO, your scholarship assistant. I can help you with:\n\n• **Eligibility** — \"Am I eligible for Post-Matric scholarship?\"\n• **Application Status** — \"Where is my application?\"\n• **Documents** — \"What documents are missing?\"\n• **Payments** — \"When will I receive payment?\"\n• **Next Steps** — \"What should I do next?\"\n• **Scheme Information** — \"Tell me about Top Class scheme\"\n\nHow can I help you today?";
  }
}

// POST /api/jago/chat
router.post('/chat', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const { intent, params } = detectIntent(message);
  const response = generateResponse(intent, userId, params);

  // Determine which tools were used
  const toolsUsed: string[] = [];
  switch (intent) {
    case 'check_eligibility': toolsUsed.push('getStudentProfile', 'getScholarshipEligibility'); break;
    case 'application_status': toolsUsed.push('getApplications', 'getApplicationStatus'); break;
    case 'missing_documents': toolsUsed.push('getMissingDocuments'); break;
    case 'payment_status': toolsUsed.push('getPaymentStatus'); break;
    case 'why_pending': toolsUsed.push('getApplications', 'getVerificationStatus'); break;
    case 'existing_benefits': toolsUsed.push('getExistingBenefits'); break;
    case 'next_steps': toolsUsed.push('getStudentProfile', 'getApplications', 'getMissingDocuments', 'getScholarshipEligibility'); break;
    case 'scheme_info': toolsUsed.push('getSchemeInformation'); break;
    case 'verification_status': toolsUsed.push('getVerificationStatus'); break;
  }

  res.json({
    success: true,
    data: {
      response,
      intent,
      toolsUsed,
      disclaimer: 'JAGO provides guidance based on available system information. Final decisions are made through official scholarship processes.',
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
