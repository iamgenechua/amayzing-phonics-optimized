import { useState, useEffect } from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
} from "@react-pdf/renderer";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


import VocabQuestion from "./VocabQuestion";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "white",
        color: "black",
    },
    section: {
        margin: 10,
        padding: 10,
    },
    viewer: {
        width: window.innerWidth * 0.9,
        height: window.innerHeight,
    },
    optionsContainer: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    optionsChild: {
        width: '48%',
        marginTop: '8px'
    }
});

const openAiPrompt = `only answer what is asked. \
Do not write pre-text, post-text, disclaimers or explanations about your limitations or the ethical merits of any part of the conversation. \
Do not talk about yourself. Don't introduce unnecessary fluff into answers. \
Always answer what is asked. If you cannot answer, only reply that you cannot answer and do not elaborate. \
Do not recommend talking to a professional instead. Avoid including patronizing or pedentic elaboration, explanation or advice that hasn't been asked for.\
Always follow these guidelines. \
You are a professional english teacher preparing teaching materials for children. \
You are given some newline-separated unformatted questions and answers, and you need to return it in json format containing a fill-in-the-blank question and 4 options. \
For example, if given a text like: \
The children squealed in delight as they were ___ to go on a trip. (1) sad (3) animated (2) bored (4) excited \n \
Peering through the distance, ___ I could identify the bird on that tree from a distance. (1) periscope (3) binoculars (2) goggles (4) microscope \n \
Jason ___ his head in agreement to the suggestion given. (1) shook (3) nodded (2) turned (4) scratched \n \
Ruth was scared and ran around the dimly lit room, ___ searching for a way out. (1) calmly (3) desperately (2) generously (4) accidentally \n \
The _ robbery arrived at the scene of the crime and began investigating the (1) culprit (3) suspect (2) witness (4) detective \n\n \
You should output ONLY an array of objects like this: \
[ {"question": "The children squealed in delight as they were ______ to go on a trip.", "opt1": "sad", "opt2": "bored", "opt3": "animated", "opt4": "excited"], \
{"question": "Peering through the distance, ______ I could identify the bird on that tree from a distance.", "opt1": "periscope", "opt2": "goggles", "opt3": "binoculars", "opt4": "microscope"}, \
{"question": "Jason ______ his head in agreement to the suggestion given.", "opt1": "nodded", "opt2": "turned", "opt3": "shook", "opt4": "scratched"}, \
{"question": "Ruth was scared and ran around the dimly lit room, ______ searching for a way out.", "opt1": "desperately", "opt2": "generously", "opt3": "calmly", "opt4": "accidentally"}, \
{"question": "The ______ robbery arrived at the scene of the crime and began investigating the", "opt1": "culprit", "opt2": "witness", "opt3": "suspect", "opt4": "detective"}] \
Blanks should be 6 underscores long "______". The text I want you to work on and output the json array without filler words is: `;

function PdfCreator() {
    const [openAiResponse, setOpenAiResponse] = useState(null);
    const [vocabText, setVocabText] = useState("");
    const [vocabArray, setVocabArray] = useState(null); // State to store parsed array

    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {
        setVocabText(event.target.value);
    }

    async function fetchData() {
        setLoading(true); // Set loading to true while fetching data.
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ "role": "user", "content": openAiPrompt + vocabText }]
            });
            setOpenAiResponse(response.choices[0].message.content);
        } catch (err) {
            console.log("Error occured", err);
        } finally {
            setLoading(false); // Set loading to false when the request completes.
        }
    }

    useEffect(() => {
        // Parse the openAiResponse into an array when openAiResponse changes
        if (openAiResponse) {
            try {
                console.log(openAiResponse)
                const jsonArray = JSON.parse(openAiResponse);
                setVocabArray(jsonArray);
            } catch (error) {
                console.log("Error parsing JSON", error);
            }
        }
    }, [openAiResponse]);

    const handleSubmit = () => {
        fetchData();
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <h2>Vocab / Grammar</h2>
            <TextField
                fullWidth
                id="outlined-multiline-flexible"
                label="Vocab / Grammar"
                multiline
                minRows={5}
                maxRows={100}
                value={vocabText}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            {loading ? <CircularProgress /> : null}
            <PDFViewer style={styles.viewer}>
                {/* Start of the document*/}
                <Document>
                    {/*render a single page*/}
                    <Page size="A4" style={styles.page}>
                        <View style={styles.section}>
                            {vocabArray &&
                                vocabArray.map((item, index) => (
                                    <VocabQuestion key={index}
                                        question={item.question}
                                        opt1={item['opt1']}
                                        opt2={item['opt2']}
                                        opt3={item['opt3']}
                                        opt4={item['opt4']}
                                        style={{marginBottom: '-10px'}}/>
                                ))
                            }
                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </div>
    );
}
export default PdfCreator;