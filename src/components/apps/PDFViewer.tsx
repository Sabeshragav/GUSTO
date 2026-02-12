'use client';

import { useEffect } from 'react';
import { Download, Mail, Globe, MapPin } from 'lucide-react';
import { useAchievements } from '../../contexts/AchievementsContext';

const pdfContent = {
  name: 'GUSTO 2025 Registration',
  title: 'Official Event Registration Form',
  email: 'gustoreg25gcee@gmail.com',
  location: 'GCE, Erode',
  website: 'gustogcee.in',
  summary: 'This document serves as the official registration confirmation and event pass for GUSTO 2025. Please present this at the registration desk.',
  experience: [
    {
      role: 'Technical Symposium',
      company: 'Department of IT',
      period: 'April 23, 2025',
      highlights: [
        'Paper Presentation',
        'Project Expo',
        'Code Debugging',
        'Blind Coding',
      ],
    },
  ],
  skills: [
    'Innovation', 'Technology', 'Creativity', 'Engineering',
  ],
  education: {
    degree: 'Certificate of Participation',
    school: 'Government College of Engineering, Erode',
    year: '2025',
  },
};

export function PDFViewer() {
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    unlockAchievement('actually-read-it');
  }, [unlockAchievement]);

  const handleDownload = () => {
    const text = `
${pdfContent.name}
${pdfContent.title}

Contact: ${pdfContent.email} | ${pdfContent.location} | ${pdfContent.website}

SUMMARY
${pdfContent.summary}

EVENTS
${pdfContent.experience.map(exp => `
${exp.role}
${exp.company} | ${exp.period}
${exp.highlights.map(h => `- ${h}`).join('\n')}
`).join('\n')}

TAGS
${pdfContent.skills.join(', ')}

ISSUED BY
${pdfContent.education.school}, ${pdfContent.education.year}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registration_details.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-warm-800/30 bg-desktop-surface/50">
        <span className="text-sm text-warm-400">registration.pdf</span>
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-warm-700 hover:bg-warm-600 text-warm-200 text-sm rounded transition-colors"
          onClick={handleDownload}
        >
          <Download size={14} />
          Download
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-warm-900/50 p-8">
        <div className="max-w-2xl mx-auto bg-white text-gray-900 shadow-xl rounded-sm">
          <div className="p-8">
            <header className="text-center mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{pdfContent.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{pdfContent.title}</p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Mail size={14} />
                  {pdfContent.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {pdfContent.location}
                </span>
                <span className="flex items-center gap-1">
                  <Globe size={14} />
                  {pdfContent.website}
                </span>
              </div>
            </header>

            <section className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{pdfContent.summary}</p>
            </section>

            <section className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Event Details
              </h2>
              <div className="space-y-5">
                {pdfContent.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500">{exp.period}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-gray-700 flex">
                          <span className="mr-2 text-gray-400">-</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {pdfContent.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Certification
              </h2>
              <div>
                <h3 className="font-semibold text-gray-900">{pdfContent.education.degree}</h3>
                <p className="text-sm text-gray-600">
                  {pdfContent.education.school}, {pdfContent.education.year}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
