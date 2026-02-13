const paperPresentImg = "/assets/events/paper.jpg";
const projectPresentImg = "/assets/events/project.jpg";
const blindCodingImg = "/assets/events/coding.jpg";
const huntModsImg = "/assets/events/hunt.jpg";
const memeContestImg = "/assets/events/meme.jpg";
const photographyImg = "/assets/events/photo.jpg";

const paperPresentationEmail = "paper.gusto26@example.com";
const projectPresentationEmail = "project.gusto26@example.com";
const blindCodingRegLink = "#";
const huntModsRegLink = "#";
const memeContestEmail = "meme.gusto26@example.com";
const photographyContestEmail = "photo.gusto26@example.com";

export const eventDetails = {
    "technicalEvents": [
        {
            "id": "tech-1",
            "title": "Paper Presentation",
            "image": paperPresentImg,
            "description": "Showcase your research and technical knowledge through a formal paper presentation. Present innovative ideas and solutions to technical challenges in this competitive academic forum.",
            "rules": [
                "The participants could be solo, a team of two or three.",
                "Participant must submit abstract of their paper during the registration process on or before 20th April 2025.",
                "Papers will be shortlisted based on the quality, relevance and originality of the abstract.",
                "And also attach the PPT of the presentation as soon as possible.",
                "Author of the shortlisted paper will be notified of acceptance via mail before 21st April 2025.",
                "Accepted authors will receive instructions on how to proceed with full paper submission.",
                "Author of accepted paper are asked to be ready with oral PowerPoint presentation for 7 to 10 min which will be the on-stage event.",
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
            "title": "Blind Coding",
            "image": blindCodingImg,
            "description": "A challenging coding competition where participants get only one chance to execute their program correctly, testing their ability to write error-free code without immediate feedback. This unique format evaluates programming accuracy and problem-solving skills under time pressure.",
            "rules": {
                "round1": {
                    "title": "Round 1 : 15 mins",
                    "rules": [
                        "Participants will be given a simple problem statement with input and output requirements.",
                        "Programming languages: C, Python, Java.",
                        "They must type the code in their preferred programming language.",
                        "The program must be run only once, with proctoring by volunteers.",
                        "Any errors faced during the first attempt at running the program lead to elimination.",
                        "The participant to successfully run the program (based on time) or provide the best output will be shortlisted for the second round."
                    ]
                },
                "round2": {
                    "title": "Round 2 : 15 mins",
                    "rules": [
                        "The difficulty level of the question will be set to medium.",
                        "Any errors faced during the first attempt at running the program lead to elimination.",
                        "The first participant to successfully run the program (based on time) or provide the best output will be declared the winner of the contest."
                    ]
                }
            },
            "coordinator1": {
                "name": "SANUKTHA A",
                "phone": "9361334075"
            },
            "coordinator2": {
                "name": "DIVYASRI K",
                "phone": "8667797100"
            },
            "coordinator3": {
                "name": "SURIYA P",
                "phone": "6383150516"
            },
            "time": "11:00 AM",
            "venue": "IT Computer Lab 3",
            "registrationLink": blindCodingRegLink
        },
        {
            "id": "tech-ind-2",
            "title": "Hunt Mods",
            "image": huntModsImg,
            "description": "Embark on a technical treasure hunt that combines problem-solving, cryptography, and coding skills. Navigate through a series of technical puzzles and challenges to reach the final goal.",
            "rules": {
                "round1": {
                    "title": "Round 1 : 30 mins",
                    "rules": [
                        "Individual participation only.",
                        "The code has a logical error in it, the participants need to alter the logic and provide the output mentioned.",
                        "Preferred programming language: C, Python, Java.",
                        "The program must be run only once, with proctoring by volunteers.",
                        "Participants can run the code 'N' times within the allocated time.",
                        "The participant to successfully run the program (based on time) or provide the best output will be shortlisted for the second round."
                    ]
                },
                "round2": {
                    "title": "Round 2 : 30 mins",
                    "rules": [
                        "The difficulty level of the question will be set to medium.",
                        "Participants can run the code 'N' times within the allocated time.",
                        "Time is everything for the event, no extended time for participants.",
                        "The participant to successfully run the program (based on time) or provide the best output will be declared the winner of the contest."
                    ]
                }
            },
            "coordinator1": {
                "name": "NANDHAKUMAR S",
                "phone": "7695966279"
            },
            "coordinator2": {
                "name": "Ganga B",
                "phone": "8072017045"
            },
            "coordinator3": {
                "name": "MANISHA M",
                "phone": "8778756323"
            },
            "time": "12:20 PM",
            "venue": "IT Computer Lab 2",
            "registrationLink": huntModsRegLink
        }
    ],
    "nonTechnicalEvents": [
        {
            "id": "non-tech-1",
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
            "id": "non-tech-2",
            "title": "Photography",
            "image": photographyImg,
            "description": "Capture the essence of the given theme through your camera lens. Demonstrate your photography skills, artistic vision, and ability to tell a story through images.",
            "rules": [
                "Online Event",
                "Allowed Themes: Nature and Landscapes, Animals, The Color Green (Elements of Design), I Want to Go There (Travel/Place), Flowers, Details/Macro.",
                "Participants are required to work independently; group submissions are not permitted. The use of AI-generated content is strictly prohibited. Collages are not allowed; submissions must consist of a single photograph.",
                "Each participant may submit only one photo. The aspect ratio of the photo must be 3:4. Only minimal touch editing is permitted. Any form of plagiarism will result in disqualification.",
                "All photos must be uploaded online by April 20, 2025, via the designated photography submission email.",
                "Winners will be notified and rewarded with prizes."
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
        }
    ]
};
