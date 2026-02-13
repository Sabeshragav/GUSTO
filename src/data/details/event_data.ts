const paperPresentImg = "/assets/events/paper.jpg";
const projectPresentImg = "/assets/events/project.jpg";
const thinkCompilerImg = "/assets/events/compiler.jpg";
const codeChaosImg = "/assets/events/codechaos.jpg";
const promptXImg = "/assets/events/promptx.jpg";
const memeContestImg = "/assets/events/meme.jpg";
const photographyImg = "/assets/events/photo.jpg";
const shortFilmImg = "/assets/events/shortfilm.jpg";
const iconIQImg = "/assets/events/iconiq.jpg";

const paperPresentationEmail = "subramanidhaya77@gmail.com";
const projectPresentationEmail = "project.gusto26@example.com";
const thinkCompilerRegLink = "#";
const codeChaosRegLink = "#";
const promptXRegLink = "#";
const memeContestEmail = "meme.gusto26@example.com";
const photographyContestEmail = "photo.gusto26@example.com";
const shortFilmEmail = "shortfilm.gusto26@example.com";
const iconIQRegLink = "#";

export const eventDetails = {
    "technicalEvents": [
        {
            "id": "tech-1",
            "title": "Paper Presentation",
            "image": paperPresentImg,
            "description": "The Paper Presentation technical event provides a platform for students to present their innovative ideas and research work. The event focuses on evaluating participants' understanding of the topics, Originality of ideas, communication skills, and presentation abilities.",
            "rules": [
                "Solo and Team Participation of maximum three members are allowed.",
                "Participant must submit Abstract of their paper during the registration process on or before the deadline.",
                "Papers will be shortlisted based on the Quality, Relevance and Originality of the Abstract.",
                "Author of the shortlisted paper will be notified of Acceptance via mail before the announcement date.",
                "Accepted authors will receive instructions on how to proceed with full paper submission. Registration and payment must be completed on or before the deadline.",
                "Author of accepted paper are asked to be ready with oral PowerPoint presentation for 7 to 10 min which will be the stage event.",
                "Winning contestant will be rewarded by the attractive cash prizes."
            ],
            "coordinator1": {
                "name": "DHAYANITHI S",
                "phone": "9344347148"
            },
            "coordinator2": {
                "name": "SANDHIYA D",
                "phone": "8248147117"
            },
            "coordinator3": {
                "name": "PRAVEENRAJ V",
                "phone": "8838828045"
            },
            "time": "10:30 AM",
            "venue": "Main Auditorium",
            "submission_name": "Abstract Submission Email",
            "submission_Email": paperPresentationEmail
        },
        {
            "id": "tech-2",
            "title": "Project Presentation",
            "image": projectPresentImg,
            "description": "Demonstrate your engineering skills by presenting a working project or prototype. Explain your design process, implementation challenges, and results in this showcase of technical innovation.",
            "rules": [
                "The participants could be solo, a team of two or three.",
                "The participants must upload their project abstract, along with the existing system, proposed solutions with methodology, and scope, with a maximum of 5 pages as a soft copy during registration.",
                "The participants must bring their working project model and presentation slides.",
                "Presentation will approximately take 5-10 minutes per team, followed by a live demonstration of the project.",
                "The participants must provide their project report (hard copy).",
                "Batches will be allocated based on registration. The last date to send the abstract is 20th April 2025, and you will receive the shortlists on 21th April 2025 via mail.",
                "The winners will be determined by juries.",
                "Contestants who violate the rules and guidelines will be eliminated instantly."
            ],
            "coordinator1": {
                "name": "KAVIKUMAR B",
                "phone": "8870822957"
            },
            "coordinator2": {
                "name": "NIGIL KUMAR M",
                "phone": "9597209198"
            },
            "coordinator3": {
                "name": "SIVARANJANI S",
                "phone": "8220174412"
            },
            "time": "10:30 AM",
            "venue": "IT Computer Lab 1",
            "submission_name": "Abstract Submission Email",
            "submission_Email": projectPresentationEmail
        }
    ],
    "technicalIndividualEvents": [
        {
            "id": "tech-ind-1",
            "title": "Think Like a Compiler",
            "image": thinkCompilerImg,
            "description": "Think like a Compiler is a technical programming event designed to evaluate participants' ability to analyse, interpret, and correct code with precision. The event challenges participants to approach programming problems from a compiler's perspective by focusing on syntax accuracy, logical correctness, and output prediction. This event enhances debugging capability, analytical thinking, and strong understanding of programming fundamentals. It simulates real-world coding scenarios where developers must identify errors quickly and produce efficient and error-free solutions under time constraints.",
            "rules": {
                "round1": {
                    "title": "Level 1 — Think Like a Compiler (30 Minutes)",
                    "description": "In this level, participants analyze the given code without using a system or compiler. They must use their own reasoning skills to identify errors, logical mistakes, or predict the output. Instead of executing the program on a computer, participants mentally run the code step by step.",
                    "rules": [
                        "Participants must not use any computer, compiler, mobile phone, or external devices during the event.",
                        "All answers must be based only on logical thinking and manual analysis of the given code.",
                        "Participants should carefully analyze the syntax, logic, and flow of the program before answering.",
                        "The given program should not be executed on any system under any circumstances.",
                        "Each participant must complete the task within the given time limit.",
                        "Discussion with other participants is strictly prohibited during the event.",
                        "Any form of malpractice or copying will lead to immediate disqualification.",
                        "Answers must be written clearly and submitted within the allotted time.",
                        "Marks will be awarded based on correctness, logic, and explanation (if required).",
                        "The decision of the event coordinators/judges will be final."
                    ]
                },
                "round2": {
                    "title": "Level 2 — Flip the Code (30 Minutes)",
                    "description": "In this level, participants are given a program in which the lines of code are shuffled or arranged in the wrong order. Along with the program, the expected output is also provided. The task of the participants is to carefully analyze the given code, rearrange the lines in the correct sequence, and make the program produce the exact output.",
                    "rules": [
                        "Participants will be given a program with shuffled or misplaced lines of code.",
                        "The expected output will be provided along with the program.",
                        "Participants must rearrange the code lines in the correct order to match the given output.",
                        "Use of computers, compilers, mobile phones, or any external devices is strictly prohibited.",
                        "The program must not be executed on any system during the event.",
                        "All solutions must be based on logical thinking and manual analysis.",
                        "Participants must complete the task within the given time limit.",
                        "Discussion with other participants is not allowed during the event.",
                        "Any form of copying or malpractice will result in disqualification.",
                        "Answers must be written clearly and submitted within the given time.",
                        "Marks will be awarded based on correctness, logic, and efficiency of the solution.",
                        "The decision of the event coordinators/judges will be final."
                    ]
                }
            },
            "coordinator1": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "coordinator2": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "time": "TBD",
            "venue": "TBD",
            "registrationLink": thinkCompilerRegLink
        },
        {
            "id": "tech-ind-2",
            "title": "Code Chaos",
            "image": codeChaosImg,
            "description": "Code Chaos is a two-stage programming challenge designed to evaluate precision, logic building, and debugging ability under time pressure. Participants must first demonstrate accuracy by writing flawless code without feedback, and then prove analytical strength by correcting and optimizing faulty logic. The contest simulates real-world development conditions where both correctness and reasoning speed determine success.",
            "rules": {
                "round1": {
                    "title": "Level 1 — Blind Coding (30 Minutes)",
                    "description": "Participants must solve a programming problem without any trial-and-error execution advantage.",
                    "rules": [
                        "Individual participation only.",
                        "A problem statement with input and output format will be provided.",
                        "Allowed languages: C, Python, Java.",
                        "Participants must type and submit the complete program.",
                        "Any runtime or compilation error results in elimination.",
                        "Participants who successfully execute the program or produce the closest correct output within time will qualify for Level 2."
                    ]
                },
                "round2": {
                    "title": "Level 2 — Hunt Debugging (30 Minutes)",
                    "description": "Participants must identify and correct logical errors in a given program.",
                    "rules": [
                        "A code containing logical flaws will be provided.",
                        "Participants must analyze, modify, and provide the mentioned output.",
                        "Multiple executions are allowed within the allotted time.",
                        "Difficulty level: Medium.",
                        "Shortlisting and final ranking will be based on: Correctness of output, Completion time, and Logical accuracy."
                    ]
                },
                "general": {
                    "title": "General Rules",
                    "rules": [
                        "Strictly individual event.",
                        "No external assistance or internet usage allowed.",
                        "Decisions of the coordinators/judges are final.",
                        "Any malpractice leads to immediate disqualification."
                    ]
                }
            },
            "coordinator1": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "coordinator2": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "time": "TBD",
            "venue": "TBD",
            "registrationLink": codeChaosRegLink
        },
        {
            "id": "tech-ind-3",
            "title": "PROMPTX",
            "image": promptXImg,
            "description": "PROMPTX is an individual AI-based competition that evaluates participants on prompt engineering skills, accuracy, efficiency, and time management. The event challenges participants to generate precise AI outputs using well-structured prompts. Participants will compete across two rounds, each designed to test different aspects of AI interaction.",
            "rules": {
                "round1": {
                    "title": "Round 1 — Image Recreation",
                    "description": "Participants will be provided with 5 AI-generated reference images. Each image must be recreated as accurately as possible using AI image generation tools.",
                    "rules": [
                        "5 AI-generated reference images will be provided.",
                        "Each image must be recreated as accurately as possible.",
                        "AI Tools allowed: Midjourney, Stable Diffusion.",
                        "Time limit: 5 minutes per image.",
                        "Maximum of 3 prompts allowed per image.",
                        "Only one AI tool must be selected and used throughout the round."
                    ]
                },
                "round2": {
                    "title": "Round 2 — Web Page Replication",
                    "description": "Participants will be given 2 web page design references (screenshots). Each web page must be replicated using AI-generated code. The designs must be recreated using vanilla HTML, CSS, and JavaScript only.",
                    "rules": [
                        "2 web page design references (screenshots) will be provided.",
                        "Each web page must be replicated using AI-generated code.",
                        "Designs must be recreated using vanilla HTML, CSS, and JavaScript only.",
                        "AI Tools allowed: ChatGPT, Claude, Gemini.",
                        "Time limit: 5 minutes per webpage.",
                        "Maximum of 3 prompts allowed per webpage.",
                        "Only one AI tool must be selected and used throughout the round."
                    ]
                },
                "general": {
                    "title": "General Rules",
                    "rules": [
                        "PROMPTX is an individual event. Team participation is not allowed.",
                        "Time limit is 5 minutes per image and per webpage.",
                        "Maximum of 3 prompts are allowed per image and per webpage.",
                        "Participants must use only the AI tools specified for each round. Use of any other AI tool will result in disqualification.",
                        "For each round, only one AI tool must be selected and the same tool must be used till the end.",
                        "Manual intervention is strictly prohibited.",
                        "Switching AI tools during a round is not permitted.",
                        "All prompts used and final outputs must be submitted for evaluation.",
                        "Participants must bring their own laptop (mandatory)."
                    ]
                }
            },
            "coordinator1": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "coordinator2": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "time": "TBD",
            "venue": "TBD",
            "registrationLink": promptXRegLink
        }
    ],
    "nonTechnicalEvents": [
        {
            "id": "non-tech-1",
            "title": "Photography",
            "image": photographyImg,
            "description": "Capture the essence of a theme through your camera lens and tell a compelling visual story. This photography competition encourages creativity, originality, and technical skill. Participants are expected to observe their surroundings carefully and present a single photograph that reflects strong composition, lighting, mood, and artistic vision.",
            "rules": [
                "Mode: Online Event.",
                "Allowed Themes: Frame within a Frame & Shadows, Seasonal Detail, Nostalgia, Reflective Photography.",
                "Photos must be originally captured by the participant. Images taken from browsers, websites, social media, or any online source are strictly prohibited.",
                "Participants must work individually; group submissions are not allowed. The use of AI-generated content is strictly prohibited. Collages are not allowed; submissions must consist of one single photograph only.",
                "Each participant may submit only one photograph. The aspect ratio must be 3:4. Only minimal touch editing (basic brightness, contrast, crop) is permitted. Any form of plagiarism will result in immediate disqualification.",
                "All photographs must be uploaded online by the submission deadline via the designated photography submission email.",
                "Winners will be notified and rewarded with exciting prizes."
            ],
            "coordinator1": {
                "name": "RAKAVI R",
                "phone": "8610544687"
            },
            "coordinator2": {
                "name": "GAJIN S",
                "phone": "8610802480"
            },
            "time": "Online Event",
            "submission_name": "Photography Submission Email",
            "submission_Email": photographyContestEmail
        },
        {
            "id": "non-tech-2",
            "title": "Meme Contest",
            "image": memeContestImg,
            "description": "Showcase your creativity and humor by creating original memes based on given themes. Express your wit and design skills in this light-hearted yet competitive event.",
            "rules": [
                "Online Event",
                "Only individual participation is permitted; no group entries.",
                "Memes must be created only based on provided situations.",
                "Created memes must be uploaded online before 20th April 2025 via meme submission email",
                "Winners will receive exciting prizes as rewards.",
                "Theme can be related to General College Life, Students struggles, fun & fest themes (Eg : hostel life, monday mood, online vs offline classes, That one professor, college crush, Seniors advice be Like ) ",
                "Memes containing adult content or depicting violence are strictly prohibited and will not be considered."
            ],
            "coordinator1": {
                "name": "VINUBHARATHI M S",
                "phone": "6385923217"
            },
            "coordinator2": {
                "name": "MAHATHMA E",
                "phone": "6374655791"
            },
            "time": "Online Event",
            "submission_name": "Meme Submission Email",
            "submission_Email": memeContestEmail
        },
        {
            "id": "non-tech-3",
            "title": "Short Film Competition",
            "image": shortFilmImg,
            "description": "The Short Film Competition aims to provide a creative platform for students to showcase their storytelling, directing, and technical skills through visual media. This event encourages participants to express innovative ideas, social messages, and artistic perspectives using short films. The competition will be conducted in online mode, enabling participants to submit their entries digitally for evaluation by the judging panel.",
            "rules": [
                "Each team may consist of 1 to 5 members. Open to students from all departments and colleges.",
                "The short film must be 20 to 30 minutes only.",
                "Open theme with a meaningful message. Any language is allowed.",
                "English subtitles are compulsory if the film is not in English.",
                "The film must be in MP4 format. Minimum resolution: 1080p (Full HD).",
                "Participants must upload their short film to Google Drive and ensure that the link is shared with viewing access for evaluation purposes.",
                "The film must be original. Only copyright-free music and content should be used. Proper credits must be given wherever required.",
                "The film should not contain any vulgar, offensive, or inappropriate content. Such entries will be disqualified.",
                "Films will be judged based on: Story and Message, Creativity, Direction and Editing, Cinematography, and Overall Impact.",
                "Each team can submit only one entry.",
                "The organizing committee reserves the right to modify rules if necessary."
            ],
            "coordinator1": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "coordinator2": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "time": "Online Event",
            "submission_name": "Short Film Submission Email",
            "submission_Email": shortFilmEmail
        },
        {
            "id": "non-tech-4",
            "title": "Icon IQ",
            "image": iconIQImg,
            "description": "Icon IQ is a challenging and interactive technical event that tests participants' visual intelligence, logical thinking, and IT awareness. The event consists of two engaging rounds where participants analyze logos and images carefully to identify the correct answers. This event focuses on accuracy, observation skills, and quick decision-making under time pressure.",
            "rules": {
                "round1": {
                    "title": "Round 1 — Logo Guessing Game",
                    "description": "Participants will be shown similar-looking logos and must identify the correct logo.",
                    "rules": [
                        "Half logos will be displayed, and participants must guess the complete logo using the given options.",
                        "A logo image will be shown, and participants must identify the correct logo name.",
                        "Questions will be based on IT companies, software, applications, and technology-related logos.",
                        "Any wrong answer or rule violation may lead to elimination.",
                        "Participants with the best accuracy and performance will be shortlisted for Round 2."
                    ]
                },
                "round2": {
                    "title": "Round 2 — Connection Game",
                    "description": "Participants will be shown multiple images related to technical concepts.",
                    "rules": [
                        "By connecting the given images, participants must identify the correct technical word or concept.",
                        "Similar images may be displayed to find a common connection.",
                        "This round tests logical thinking, technical knowledge, and analytical skills.",
                        "The participant who provides the best output will be declared the winner."
                    ]
                },
                "general": {
                    "title": "General Rules",
                    "rules": [
                        "This is an individual Non-Technical event.",
                        "This is an offline event.",
                        "Participants must answer only based on the images and clues provided.",
                        "Use of mobile phones, internet access, or any external assistance is strictly prohibited.",
                        "Participants must follow the instructions given by the coordinators.",
                        "Any form of malpractice will lead to immediate disqualification.",
                        "The judges' decision will be final and binding."
                    ]
                }
            },
            "coordinator1": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "coordinator2": {
                "name": "TBD",
                "phone": "0000000000"
            },
            "time": "TBD",
            "venue": "TBD",
            "registrationLink": iconIQRegLink
        }
    ]
};
