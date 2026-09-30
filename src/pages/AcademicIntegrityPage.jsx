import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { TEXT_LINK } from '@/components/public/PublicPage';
import PolicySection from '@/components/legal/PolicySection';
import { AlertTriangle, CheckCircle, Mail, ShieldAlert } from 'lucide-react';

const tocItems = [
  { id: 'statement', label: '1. Integrity Statement' },
  { id: 'dishonesty', label: '2. Academic Dishonesty' },
  { id: 'plagiarism', label: '3. Plagiarism Policy' },
  { id: 'collaboration', label: '4. Collaboration Rules' },
  { id: 'consequences', label: '5. Consequences' },
  { id: 'resources', label: '6. Support Resources' },
  { id: 'reporting', label: '7. Reporting Violations' },
];

const AcademicIntegrityPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalPageLayout 
      title="Academic Integrity Policy" 
      lastUpdated="December 18, 2025" 
      tocItems={tocItems}
    >
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="print:hidden">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </div>
      <div className="text-xl text-pl-muted mb-10 leading-relaxed border-l-4 border-pl-accent pl-6 py-2 bg-pl-surface rounded-r-lg flex items-start gap-4">
        <div>
           Petrolord NextGen is built on a foundation of trust and professional ethics. We are committed to fostering an environment where learning is genuine, and achievements are earned.
        </div>
      </div>

      <PolicySection id="statement" title="1. Academic Integrity Statement">
        <p>
          Academic integrity is the pursuit of scholarly activity in an open, honest, and responsible manner. All students, faculty, and staff are expected to act with honesty, trust, fairness, respect, and responsibility.
        </p>
        <p>
          Engineering and geoscience are safety-critical professions where integrity is paramount. Falsifying data or misrepresenting work in an academic setting undermines the core values of the profession and endangers future safety practices.
        </p>
      </PolicySection>

      <PolicySection id="dishonesty" title="2. Definition of Academic Dishonesty">
        <p>Academic dishonesty includes, but is not limited to, the following behaviors:</p>
        
        <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="p-4 bg-pl-danger-bg border border-pl-danger/40 rounded-lg">
                <h4 className="text-pl-danger-text font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Cheating
                </h4>
                <p className="text-sm text-pl-text">Using unauthorized notes, aids, or information on an examination or assignment.</p>
            </div>
            <div className="p-4 bg-pl-danger-bg border border-pl-danger/40 rounded-lg">
                <h4 className="text-pl-danger-text font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Fabrication
                </h4>
                <p className="text-sm text-pl-text">Inventing or falsifying data, citations, or information in any academic exercise.</p>
            </div>
            <div className="p-4 bg-pl-danger-bg border border-pl-danger/40 rounded-lg">
                <h4 className="text-pl-danger-text font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Unauthorized Access
                </h4>
                <p className="text-sm text-pl-text">Accessing or manipulating platform data or systems to gain an unfair advantage.</p>
            </div>
            <div className="p-4 bg-pl-danger-bg border border-pl-danger/40 rounded-lg">
                <h4 className="text-pl-danger-text font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Facilitation
                </h4>
                <p className="text-sm text-pl-text">Helping or attempting to help another student commit an act of academic dishonesty.</p>
            </div>
        </div>
      </PolicySection>

      <PolicySection id="plagiarism" title="3. Plagiarism Policy">
        <p>
          Plagiarism is the adoption or reproduction of ideas, words, or statements of another person without due acknowledgment. In the Petrolord NextGen environment, this includes:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>Submitting another user's simulation results as your own.</li>
          <li>Copying code, scripts, or workflow configurations without attribution.</li>
          <li>Using AI-generated content (like ChatGPT) to complete essay or analysis questions without permission or citation.</li>
        </ul>
        <div className="mt-4 p-4 bg-pl-surface rounded-lg border-l-4 border-pl-accent">
            <p className="text-sm text-pl-text">
                <strong>Correct Practice:</strong> Always cite sources used in your reports. If you use a template or public workflow, acknowledge the original creator.
            </p>
        </div>
      </PolicySection>

      <PolicySection id="collaboration" title="4. Collusion & Collaboration">
        <p>
          We encourage collaboration, but there is a clear distinction between working together and copying.
        </p>
        <h3 className="text-pl-text font-semibold mt-4 mb-2">Allowed Collaboration</h3>
        <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-pl-text">
                <CheckCircle className="w-5 h-5 text-pl-success-text mt-0.5 shrink-0" />
                Discussing general concepts and approaches to a problem.
            </li>
            <li className="flex items-start gap-2 text-pl-text">
                <CheckCircle className="w-5 h-5 text-pl-success-text mt-0.5 shrink-0" />
                Peer-reviewing workflows to identify logic errors (without fixing them for the student).
            </li>
            <li className="flex items-start gap-2 text-pl-text">
                <CheckCircle className="w-5 h-5 text-pl-success-text mt-0.5 shrink-0" />
                Group projects where tasks are divided and contributions are documented.
            </li>
        </ul>

        <h3 className="text-pl-text font-semibold mt-4 mb-2">Unauthorized Collusion</h3>
        <ul className="space-y-2">
            <li className="flex items-start gap-2 text-pl-text">
                <ShieldAlert className="w-5 h-5 text-pl-danger-text mt-0.5 shrink-0" />
                Sharing login credentials to allow another to complete work.
            </li>
            <li className="flex items-start gap-2 text-pl-text">
                <ShieldAlert className="w-5 h-5 text-pl-danger-text mt-0.5 shrink-0" />
                Sharing finished report files or simulation exports for submission by another.
            </li>
        </ul>
      </PolicySection>

      <PolicySection id="consequences" title="5. Consequences of Violations">
        <p>
          Violations of this policy are taken seriously and may result in the following actions, depending on severity and frequency:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
            <li><strong>Formal Warning:</strong> Recorded on the user's internal profile.</li>
            <li><strong>Grade Penalty:</strong> A score of zero on the assignment or course module.</li>
            <li><strong>Account Suspension:</strong> Temporary loss of access to the platform.</li>
            <li><strong>University Notification:</strong> Reporting the incident to the user's academic institution for disciplinary action.</li>
            <li><strong>Expulsion:</strong> Permanent ban from the Petrolord NextGen platform.</li>
        </ol>
      </PolicySection>

      <PolicySection id="resources" title="6. Resources & Support">
        <p>
          We want you to succeed honestly. If you are struggling with coursework or a technical problem, write to the academy team and ask for help.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <a href="mailto:info@petrolord.com" className="p-4 bg-pl-surface hover:bg-pl-sunken rounded-lg border border-pl-border transition-colors flex items-center gap-3">
                <Mail className="w-6 h-6 text-pl-primary-text" aria-hidden="true" />
                <div>
                    <div className="font-bold text-pl-text">Contact the academy</div>
                    <div className="text-xs text-pl-muted">info@petrolord.com</div>
                </div>
            </a>
        </div>
      </PolicySection>

      <PolicySection id="reporting" title="7. Reporting Violations">
        <p>
          If you witness a violation of this policy, you have a responsibility to report it. Maintaining the integrity of the platform benefits everyone.
        </p>
        <p className="mt-4">
           You can report suspected violations confidentially via email at <a href="mailto:integrity@petrolord.com" className={TEXT_LINK}>integrity@petrolord.com</a>. All reports are investigated discreetly.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
};

export default AcademicIntegrityPage;