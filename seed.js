import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "./config/db.js";
import Question from "./models/question.js";

dotenv.config();
const questions = [
    { "no": 1, "question": "The Portuguese contributed many things to Kerala. In the following, which one is not a contribution of the Portuguese?", "options": { "A": "They promoted scientific cultivation of pepper and ginger.", "B": "They founded theological seminaries and colleges at Cochin, Angamali and Vaipincotta.", "C": "They built the Bolgatty Palace at Kochi.", "D": "They introduced new agricultural products like tobacco, pineapple, papaya etc." }, "correctAnswer": "C" },
    { "no": 2, "question": "Some of the administrative reforms of Rani Sethu Lakshmi Bai of Travancore is given. Arrange them in Chronological order: (i) Abolished Devadasi System. (ii) The city of Thiruvananthapuram was illuminated with electric lights. (iii) Animal sacrifice was banned. (iv) Introduced patrilineal nuclear family system.", "options": { "A": "iii, ii, i, iv", "B": "iii, i, iv, ii", "C": "i, iii, ii, iv", "D": "i, iv, iii, ii" }, "correctAnswer": "B" },
    { "no": 3, "question": "Match the following Presidents of the Indian National Congress with the years of their Presidentship: (a) Hakim Ajmal Khan (b) Abul Kalam Azad (c) Mahatma Gandhi (d) Vallabhbhai Patel (1) 1924 (2) 1921 (3) 1931 (4) 1923", "options": { "A": "a-1, b-3, c-2, d-4", "B": "a-3, b-1, c-4, d-2", "C": "a-4, b-3, c-1, d-2", "D": "a-2, b-4, c-1, d-3" }, "correctAnswer": "D" },
    { "no": 4, "question": "The Indian News Papers and its founders are given below. Find the incorrect pair:", "options": { "A": "Bengal Gazette - James Augustus Hicky", "B": "Samvad Kaumudi - Raja Ram Mohan Roy", "C": "Hindu Patriot - Madhusudan Ray", "D": "Mirat-Ul-Akbar - Firoz Shah Mehta" }, "correctAnswer": "D" },
    { "no": 5, "question": "Assertion (A) : China announced 'Panda Diplomacy' with the USA and Europe. Reason (R) : China announced 'Ping Pong Diplomacy' to establish official diplomatic relations with the USA.", "options": { "A": "Both (A) and (R) are true and (R) is the correct explanation of (A)", "B": "Both (A) and (R) are true but (R) is not a correct explanation of (A)", "C": "(A) is true and (R) is false", "D": "(A) is false and (R) is true" }, "correctAnswer": "B" },
    { "no": 6, "question": "Consider the following statements and find the correct one/ones: (i) In 1917 the British government formed the Saddler Commission. (ii) Wardha Education scheme was also known as 'Nai Talim'. (iii) Thomas Raleigh Commission was appointed during the period of Lord Curzon.", "options": { "A": "All of the above", "B": "i and ii only", "C": "i and iii only", "D": "ii and iii only" }, "correctAnswer": "A" },
    { "no": 7, "question": "Arrange the following incidents in the correct chronological order: (i) Execution of Vaikom Padmanabha Pillai. (ii) Thampy Chempakaraman was executed at Kannammoola. (iii) Velu Thampi committed suicide at Mannadi. (iv) Paliyath Achan was deported to Madras.", "options": { "A": "i, ii, iii, iv", "B": "ii, i, iv, iii", "C": "iii, iv, ii, i", "D": "ii, iv, iii, i" }, "correctAnswer": "D" },
    { "no": 8, "question": "Which of the following statements is/are correct about Akhand Bharat? (i) Akhand Bharat implies a United India stretching from Afghanistan to Myanmar and Sri Lanka to Tibet. (ii) The concept of Akhand Bharat is linked to the Sanskrit term 'Chakravartin'. (iii) K.M. Munshi advocated the idea of Akhand Hindustan. (iv) At the time of partition the working committee of Indian National Congress passed a resolution on Akhand Bharat.", "options": { "A": "i and ii only", "B": "i, ii and iii only", "C": "ii, iii and iv only", "D": "All of the above" }, "correctAnswer": "B" },
    { "no": 9, "question": "Which of the following statement is/are correct? (i) First modern silk textile mill was established in Mysore in 1912. (ii) Central Silk Board (CSB) was established in 1948. (iii) India is the only country in the world that produces all the five varieties of silk.", "options": { "A": "i, ii and iii", "B": "ii and iii only", "C": "i and iii only", "D": "i and ii only" }, "correctAnswer": "A" },
    { "no": 10, "question": "Arrange the states of India in the descending order of their total length of National Highways: (i) Rajasthan (ii) Uttar Pradesh (iii) Maharashtra (iv) Madhya Pradesh", "options": { "A": "iii, ii, i, iv", "B": "ii, iii, i, iv", "C": "iii, i, ii, iv", "D": "i, iii, ii, iv" }, "correctAnswer": "A" },
    { "no": 11, "question": "Match the following: (a) Koteshwar Dam - (1) Bhagirathi (b) Ranjit Sagar Dam - (2) Ravi (c) Salal Project - (3) Chenab (d) Pong Dam - (4) Beas", "options": { "A": "a-1, b-2, c-3, d-4", "B": "a-4, b-2, c-3, d-1", "C": "a-1, b-3, c-2, d-4", "D": "a-2, b-1, c-4, d-3" }, "correctAnswer": "A" },
    { "no": 12, "question": "Match the following: (a) Netravali Wildlife Sanctuary - (1) Goa (b) Bhagwan Mahavir Wildlife Sanctuary - (2) Goa (c) Cotigao Wildlife Sanctuary - (3) Goa (d) Bondla Wildlife Sanctuary - (4) Goa", "options": { "A": "a-1, b-2, c-3, d-4", "B": "a-2, b-3, c-4, d-1", "C": "a-4, b-1, c-2, d-3", "D": "a-3, b-4, c-1, d-2" }, "correctAnswer": "A" },
    { "no": 13, "question": "National Waterway - 1 is from:", "options": { "A": "Sadiya to Dhubri", "B": "Kollam to Kottapuram", "C": "Allahabad to Haldia", "D": "Kakinada to Puducherry" }, "correctAnswer": "C" },
    { "no": 14, "question": "Khardung La pass connects:", "options": { "A": "Leh and Siachen Glacier", "B": "Srinagar and Leh", "C": "Kullu and Lahaul-Spiti", "D": "Tawang and Lhasa" }, "correctAnswer": "A" },
    { "no": 15, "question": "Find out the correctly matched pairs: (i) Blue Revolution - Fisheries (ii) Grey Revolution - Fertilizers (iii) Silver Revolution - Milk (iv) Yellow Revolution - Oilseeds", "options": { "A": "i, ii and iv", "B": "ii, iii and iv", "C": "i, iii and iv", "D": "i, ii and iii" }, "correctAnswer": "A" },
    { "no": 16, "question": "The total coastline of mainland India, including Lakshadweep and Andaman & Nicobar Islands is:", "options": { "A": "6100 km", "B": "7516.6 km", "C": "15200 km", "D": "5422.6 km" }, "correctAnswer": "B" },
    { "no": 17, "question": "The correct order of Himalayan peaks from East to West is:", "options": { "A": "Namcha Barwa - Kanchenjunga - Mt. Everest - Nanda Devi", "B": "Nanda Devi - Mt. Everest - Kanchenjunga - Namcha Barwa", "C": "Kanchenjunga - Mt. Everest - Nanda Devi - Namcha Barwa", "D": "Mt. Everest - Kanchenjunga - Namcha Barwa - Nanda Devi" }, "correctAnswer": "A" },
    { "no": 18, "question": "Match the following: (a) Operation Flood - (1) Verghese Kurien (b) Green Revolution - (2) M.S. Swaminathan (c) Golden Revolution - (3) Nirpakh Tutej (d) Silver Revolution - (4) Indira Gandhi", "options": { "A": "a-1, b-2, c-3, d-4", "B": "a-2, b-1, c-4, d-3", "C": "a-1, b-3, c-2, d-4", "D": "a-4, b-2, c-3, d-1" }, "correctAnswer": "A" },
    { "no": 19, "question": "The Indian state with the highest percentage of forest area according to ISFR 2021 is:", "options": { "A": "Madhya Pradesh", "B": "Arunachal Pradesh", "C": "Mizoram", "D": "Meghalaya" }, "correctAnswer": "C" },
    { "no": 20, "question": "Who among the following wrote the book 'Poverty and Un-British Rule in India'?", "options": { "A": "Dadabhai Naoroji", "B": "Gopal Krishna Gokhale", "C": "Bal Gangadhar Tilak", "D": "R.C. Dutt" }, "correctAnswer": "A" },
    { "no": 21, "question": "The concept of 'Inclusive Growth' was introduced in which Five Year Plan?", "options": { "A": "Ninth Plan", "B": "Tenth Plan", "C": "Eleventh Plan", "D": "Twelfth Plan" }, "correctAnswer": "C" },
    { "no": 22, "question": "The first state in India to implement the Panchayati Raj system was:", "options": { "A": "Rajasthan", "B": "Andhra Pradesh", "C": "Karnataka", "D": "Gujarat" }, "correctAnswer": "A" },
    { "no": 23, "question": "Which article of the Indian Constitution deals with the Right to Equality?", "options": { "A": "Article 14-18", "B": "Article 19-22", "C": "Article 23-24", "D": "Article 25-28" }, "correctAnswer": "A" },
    { "no": 24, "question": "The chairman of the 15th Finance Commission of India is:", "options": { "A": "Y.V. Reddy", "B": "N.K. Singh", "C": "Vijay Kelkar", "D": "C. Rangarajan" }, "correctAnswer": "B" },
    { "no": 25, "question": "The 'Statue of Unity' is dedicated to which Indian leader?", "options": { "A": "Mahatma Gandhi", "B": "Jawaharlal Nehru", "C": "Sardar Vallabhbhai Patel", "D": "Dr. B.R. Ambedkar" }, "correctAnswer": "C" },
    { "no": 26, "question": "The term 'Bully' is associated with which sport?", "options": { "A": "Football", "B": "Hockey", "C": "Cricket", "D": "Basketball" }, "correctAnswer": "B" },
    { "no": 27, "question": "Which Indian state has the highest production of coffee?", "options": { "A": "Kerala", "B": "Tamil Nadu", "C": "Karnataka", "D": "Andhra Pradesh" }, "correctAnswer": "C" },
    { "no": 28, "question": "The first woman Governor of an Indian state was:", "options": { "A": "Sarojini Naidu", "B": "Sucheta Kripalani", "C": "Vijayalakshmi Pandit", "D": "Padmaja Naidu" }, "correctAnswer": "A" },
    { "no": 29, "question": "Who is known as the 'Frontier Gandhi'?", "options": { "A": "Abdul Ghaffar Khan", "B": "Vinoba Bhave", "C": "Jayaprakash Narayan", "D": "Dadabhai Naoroji" }, "correctAnswer": "A" },
    { "no": 30, "question": "The headquarters of the International Monetary Fund (IMF) is located at:", "options": { "A": "Geneva", "B": "Paris", "C": "Washington D.C.", "D": "New York" }, "correctAnswer": "C" },
    { "no": 31, "question": "Which gas is predominantly responsible for global warming?", "options": { "A": "Oxygen", "B": "Carbon dioxide", "C": "Nitrogen", "D": "Argon" }, "correctAnswer": "B" },
    { "no": 32, "question": "The unit of electric current is:", "options": { "A": "Volt", "B": "Ohm", "C": "Ampere", "D": "Watt" }, "correctAnswer": "C" },
    { "no": 33, "question": "The largest organ in the human body is:", "options": { "A": "Liver", "B": "Lungs", "C": "Skin", "D": "Heart" }, "correctAnswer": "C" },
    { "no": 34, "question": "Penicillin was discovered by:", "options": { "A": "Edward Jenner", "B": "Alexander Fleming", "C": "Louis Pasteur", "D": "Joseph Lister" }, "correctAnswer": "B" },
    { "no": 35, "question": "The brightest planet in our solar system is:", "options": { "A": "Mercury", "B": "Venus", "C": "Mars", "D": "Jupiter" }, "correctAnswer": "B" },
    { "no": 36, "question": "Who invented the telephone?", "options": { "A": "Thomas Edison", "B": "Alexander Graham Bell", "C": "Guglielmo Marconi", "D": "Isaac Newton" }, "correctAnswer": "B" },
    { "no": 37, "question": "The chemical symbol for Gold is:", "options": { "A": "Ag", "B": "Au", "C": "Fe", "D": "Pb" }, "correctAnswer": "B" },
    { "no": 38, "question": "Which part of the plant conducts water and minerals from roots to leaves?", "options": { "A": "Phloem", "B": "Xylem", "C": "Stomata", "D": "Chloroplast" }, "correctAnswer": "B" },
    { "no": 39, "question": "The deficiency of Vitamin A causes:", "options": { "A": "Scurvy", "B": "Rickets", "C": "Night blindness", "D": "Beriberi" }, "correctAnswer": "C" },
    { "no": 40, "question": "The normal temperature of the human body is approximately:", "options": { "A": "37°C", "B": "98°C", "C": "32°C", "D": "40°C" }, "correctAnswer": "A" },
    { "no": 41, "question": "Which country won the ICC T20 World Cup 2024?", "options": { "A": "South Africa", "B": "India", "C": "Australia", "D": "England" }, "correctAnswer": "B" },
    { "no": 42, "question": "The 2024 Olympic Games were held in:", "options": { "A": "Tokyo", "B": "Paris", "C": "London", "D": "Los Angeles" }, "correctAnswer": "B" },
    { "no": 43, "question": "Who is the current Prime Minister of the United Kingdom?", "options": { "A": "Rishi Sunak", "B": "Keir Starmer", "C": "Boris Johnson", "D": "Theresa May" }, "correctAnswer": "B" },
    { "no": 44, "question": "The current Governor of Kerala is:", "options": { "A": "Arif Mohammed Khan", "B": "P. Sathasivam", "C": "Sheila Dikshit", "D": "R.L. Bhatia" }, "correctAnswer": "A" },
    { "no": 45, "question": "Which Indian movie won the Oscar for Best Original Song in 2023?", "options": { "A": "RRR", "B": "The Elephant Whisperers", "C": "Pathaan", "D": "Jawan" }, "correctAnswer": "A" },
    { "no": 46, "question": "The G20 Summit in 2023 was hosted by:", "options": { "A": "Brazil", "B": "India", "C": "Indonesia", "D": "South Africa" }, "correctAnswer": "B" },
    { "no": 47, "question": "Who is the current President of France?", "options": { "A": "Emmanuel Macron", "B": "Francois Hollande", "C": "Nicolas Sarkozy", "D": "Jacques Chirac" }, "correctAnswer": "A" },
    { "no": 48, "question": "The 2023 Nobel Peace Prize was awarded to:", "options": { "A": "Narges Mohammadi", "B": "Maria Ressa", "C": "Malala Yousafzai", "D": "Denis Mukwege" }, "correctAnswer": "A" },
    { "no": 49, "question": "Which Indian state hosted the 37th National Games in 2023?", "options": { "A": "Kerala", "B": "Goa", "C": "Gujarat", "D": "Haryana" }, "correctAnswer": "B" },
    { "no": 50, "question": "The current Chief Justice of India is:", "options": { "A": "D.Y. Chandrachud", "B": "U.U. Lalit", "C": "N.V. Ramana", "D": "S.A. Bobde" }, "correctAnswer": "A" },
    { "no": 51, "question": "Find the next number in the series: 2, 6, 12, 20, 30, ...", "options": { "A": "40", "B": "42", "C": "45", "D": "48" }, "correctAnswer": "B" },
    { "no": 52, "question": "If 15% of a number is 45, what is the number?", "options": { "A": "200", "B": "250", "C": "300", "D": "350" }, "correctAnswer": "C" },
    { "no": 53, "question": "A train 150m long is running at a speed of 54 km/hr. How much time will it take to pass a pole?", "options": { "A": "10 sec", "B": "12 sec", "C": "15 sec", "D": "20 sec" }, "correctAnswer": "A" },
    { "no": 54, "question": "The average of first five prime numbers is:", "options": { "A": "5.6", "B": "5.8", "C": "6.2", "D": "6.4" }, "correctAnswer": "A" },
    { "no": 55, "question": "The HCF of 12 and 18 is:", "options": { "A": "2", "B": "3", "C": "6", "D": "9" }, "correctAnswer": "C" },
    { "no": 56, "question": "Find the value of √0.0009:", "options": { "A": "0.3", "B": "0.03", "C": "0.003", "D": "3" }, "correctAnswer": "B" },
    { "no": 57, "question": "A man buys a cycle for Rs. 2000 and sells it for Rs. 2500. Find the profit percentage.", "options": { "A": "20%", "B": "25%", "C": "30%", "D": "35%" }, "correctAnswer": "B" },
    { "no": 58, "question": "The sum of the angles in a triangle is:", "options": { "A": "90°", "B": "180°", "C": "270°", "D": "360°" }, "correctAnswer": "B" },
    { "no": 59, "question": "Find the odd one out: 27, 64, 81, 125", "options": { "A": "27", "B": "64", "C": "81", "D": "125" }, "correctAnswer": "C" },
    { "no": 60, "question": "If CAT is coded as 3120, then DOG is coded as:", "options": { "A": "4157", "B": "4158", "C": "4167", "D": "5157" }, "correctAnswer": "A" },
    { "no": 61, "question": "Choose the correct word: He has been waiting for two ______.", "options": { "A": "ours", "B": "hours", "C": "owers", "D": "hores" }, "correctAnswer": "B" },
    { "no": 62, "question": "The synonym of 'Humble' is:", "options": { "A": "Proud", "B": "Modest", "C": "Arrogant", "D": "Rude" }, "correctAnswer": "B" },
    { "no": 63, "question": "The antonym of 'Victory' is:", "options": { "A": "Win", "B": "Defeat", "C": "Success", "D": "Triumph" }, "correctAnswer": "B" },
    { "no": 64, "question": "Choose the correctly spelt word:", "options": { "A": "Receive", "B": "Recieve", "C": "Receeve", "D": "Riceive" }, "correctAnswer": "A" },
    { "no": 65, "question": "Give one word for: A person who writes poems.", "options": { "A": "Poet", "B": "Author", "C": "Dramatist", "D": "Novelist" }, "correctAnswer": "A" },
    { "no": 66, "question": "Identify the tense: She is playing piano.", "options": { "A": "Simple Present", "B": "Present Continuous", "C": "Present Perfect", "D": "Past Continuous" }, "correctAnswer": "B" },
    { "no": 67, "question": "Choose the correct preposition: The book is _____ the table.", "options": { "A": "in", "B": "on", "C": "at", "D": "by" }, "correctAnswer": "B" },
    { "no": 68, "question": "Complete the idiom: A piece of ______ (meaning very easy).", "options": { "A": "bread", "B": "cake", "C": "pie", "D": "sweet" }, "correctAnswer": "B" },
    { "no": 69, "question": "Change into plural: 'Child'", "options": { "A": "Childs", "B": "Children", "C": "Childrens", "D": "Childes" }, "correctAnswer": "B" },
    { "no": 70, "question": "Select the correct article: He is ____ honest man.", "options": { "A": "a", "B": "an", "C": "the", "D": "no article" }, "correctAnswer": "B" },
    { "no": 71, "question": "മഞ്ഞപ്പിത്തത്തിന് കാരണമായ വൈറസ് ഏത്?", "options": { "A": "Hepatitis", "B": "Influenza", "C": "HIV", "D": "Corona" }, "correctAnswer": "A" },
    { "no": 72, "question": "കേരളത്തിലെ ആദ്യത്തെ മുഖ്യമന്ത്രി ആര്?", "options": { "A": "E.M.S. Namboodiripad", "B": "C. Achutha Menon", "C": "Pattom Thanu Pillai", "D": "R. Sankar" }, "correctAnswer": "A" },
    { "no": 73, "question": "ഇന്ത്യയുടെ വാനമ്പാടി എന്നറിയപ്പെടുന്നത് ആര്?", "options": { "A": "Lata Mangeshkar", "B": "Sarojini Naidu", "C": "M.S. Subbulakshmi", "D": "Asha Bhosle" }, "correctAnswer": "B" },
    { "no": 74, "question": "ദൈവത്തിന്റെ സ്വന്തം നാട് എന്ന് കേരളത്തെ വിശേഷിപ്പിച്ചത് ആര്?", "options": { "A": "Walter Mendez", "B": "Mahatma Gandhi", "C": "Sree Narayana Guru", "D": "Swami Vivekananda" }, "correctAnswer": "A" },
    { "no": 75, "question": "ലക്ഷദ്വീപിന്റെ തലസ്ഥാനം ഏത്?", "options": { "A": "Kavaratti", "B": "Minicoy", "C": "Agatti", "D": "Port Blair" }, "correctAnswer": "A" },
    { "no": 76, "question": "ഇന്ത്യയിലെ ഏറ്റവും നീളം കൂടിയ നദി ഏത്?", "options": { "A": "Ganges", "B": "Brahmaputra", "C": "Godavari", "D": "Indus" }, "correctAnswer": "A" },
    { "no": 77, "question": "ലോക പരിസ്ഥിതി ദിനം എന്ന്?", "options": { "A": "June 5", "B": "July 11", "C": "September 16", "at": "December 1" }, "correctAnswer": "A" },
    { "no": 78, "question": "കേരളത്തിലെ ഏറ്റവും വലിയ നദി ഏത്?", "options": { "A": "Periyar", "B": "Bharathapuzha", "C": "Pamba", "D": "Chaliyar" }, "correctAnswer": "A" },
    { "no": 79, "question": "ഗാന്ധിജി സന്ദർശിക്കാത്ത ദക്ഷിണേന്ത്യൻ സംസ്ഥാനം ഏത്?", "options": { "A": "Kerala", "B": "Tamil Nadu", "C": "Karnataka", "D": "None of these" }, "correctAnswer": "D" },
    { "no": 80, "question": "ഇന്ത്യയുടെ രാഷ്ട്രപിതാവ് ആര്?", "options": { "A": "Mahatma Gandhi", "B": "Subhash Chandra Bose", "C": "Jawaharlal Nehru", "D": "Sardar Patel" }, "correctAnswer": "A" },
    { "no": 81, "question": "How many bits are in a byte?", "options": { "A": "4", "B": "8", "C": "16", "D": "32" }, "correctAnswer": "B" },
    { "no": 82, "question": "Which company developed the Java programming language?", "options": { "A": "Microsoft", "B": "Sun Microsystems", "C": "Apple", "D": "Google" }, "correctAnswer": "B" },
    { "no": 83, "question": "What does PDF stand for?", "options": { "A": "Portable Document Format", "B": "Personal Data File", "C": "Printable Document File", "D": "Public Document Format" }, "correctAnswer": "A" },
    { "no": 84, "question": "Who is known as the father of the computer?", "options": { "A": "Charles Babbage", "B": "Alan Turing", "C": "Bill Gates", "D": "Steve Jobs" }, "correctAnswer": "A" },
    { "no": 85, "question": "Which of the following is an operating system?", "options": { "A": "Windows", "B": "Google Chrome", "C": "MS Word", "D": "VLC Player" }, "correctAnswer": "A" },
    { "no": 86, "question": "The primary memory of a computer is:", "options": { "A": "Hard Disk", "B": "RAM", "C": "Pen Drive", "D": "CD-ROM" }, "correctAnswer": "B" },
    { "no": 87, "question": "Which part of the computer is called the brain?", "options": { "A": "Monitor", "B": "Keyboard", "C": "CPU", "D": "Mouse" }, "correctAnswer": "C" },
    { "no": 88, "question": "WWW stands for:", "options": { "A": "World Wide Web", "B": "World Wireless Web", "C": "Whole Wide Web", "D": "Web Wide World" }, "correctAnswer": "A" },
    { "no": 89, "question": "Which key is used to refresh a web page?", "options": { "A": "F1", "B": "F2", "C": "F5", "D": "F12" }, "correctAnswer": "C" },
    { "no": 90, "question": "1 GB is equal to how many MB?", "options": { "A": "100", "B": "512", "C": "1024", "D": "2048" }, "correctAnswer": "C" },
    { "no": 91, "question": "വിപരീതപദം എഴുതുക: 'പൂർവ്വം'", "options": { "A": "പിൻ", "B": "അപൂർവ്വം", "C": "പശ്ചിമം", "D": "ഉത്തരം" }, "correctAnswer": "B" },
    { "no": 92, "question": "പര്യായപദം കണ്ടെത്തുക: 'അമ്മ'", "options": { "A": "ജനനി", "B": "പുത്രി", "C": "ഭഗിനി", "D": "നാരി" }, "correctAnswer": "A" },
    { "no": 93, "question": "ശരിയായ പദം തിരഞ്ഞെടുക്കുക:", "options": { "A": "ആവിശ്യം", "B": "ആവശ്യം", "C": "ആവശം", "D": "അവശ്യം" }, "correctAnswer": "B" },
    { "no": 94, "question": "അർത്ഥം കണ്ടെത്തുക: 'ഉദ്യാനം'", "options": { "A": "കാട്", "B": "പൂന്തോട്ടം", "C": "മല", "D": "വയൽ" }, "correctAnswer": "B" },
    { "no": "95", "question": "സ്ത്രീലിംഗം കണ്ടെത്തുക: 'ശിഷ്യൻ'", "options": { "A": "ശിഷ്യ", "B": "ശിഷ്യയായ", "C": "ശിഷ്യണി", "D": "ശിഷ്യകി" }, "correctAnswer": "A" },
    { "no": 96, "question": "ചൊല്ല് പൂർത്തിയാക്കുക: 'അണ്ണാൻ കുഞ്ഞിനും ______.'", "options": { "A": "തന്നാലായത്", "B": "ഓടാൻ അറിയാം", "C": "മരം കയറാം", "D": "ഭക്ഷണം വേണം" }, "correctAnswer": "A" },
    { "no": 97, "question": "പിരിച്ചെഴുതുക: 'കണ്ണീർ'", "options": { "A": "കണ് + നീർ", "B": "കണ്ണ് + നീർ", "C": "കണ് + ണീർ", "D": "കണ്ണു + ഈർ" }, "correctAnswer": "B" },
    { "no": 98, "question": "ഒറ്റപ്പദം എഴുതുക: 'ആകാശത്തു സഞ്ചരിക്കുന്നവൻ'", "options": { "A": "ആകാശഗമി", "B": "ഖേചരൻ", "C": "വിഹഗൻ", "D": "പക്ഷി" }, "correctAnswer": "B" },
    { "no": 99, "question": "തർജ്ജമ ചെയ്യുക: 'Knowledge is power.'", "options": { "A": "അറിവ് ശക്തിയാണ്", "B": "അറിവ് സമ്പത്താണ്", "C": "അറിവ് വെളിച്ചമാണ്", "D": "അറിവ് വലിയ കാര്യമാണ്" }, "correctAnswer": "A" },
    { "no": 100, "question": "The synonym of the word 'Relinquish' is:", "options": { "A": "Possess", "B": "Deny", "C": "Abandon", "D": "Retain" }, "correctAnswer": "C" }
];

const seedDB = async () => {
    try {
        await db();

        await Question.deleteMany({});
        console.log("Deleted existing questions");

        // console.log("Inserting new questions...");
        // // Handle nested structure from user copy-paste
        // const questionsToInsert = questions[0].questions || questions;
        // await Question.insertMany(questionsToInsert);

        console.log("✅ Data Cleared Successfully");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding data:", err);
        process.exit(1);
    }
};

seedDB();
