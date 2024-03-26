import React, { useState, useEffect } from 'react';
import './Translation.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";


export default function Translation() {
    const [inputTextCount, setInputTextCount] = useState();
    const [inputText, setInputText] = useState('');
    const [inputTextErorr, setInputTextErorr] = useState('');
    const [inputSentence, setInputSentence] = useState(false);
    const [translateSentence, setTranslateSentence] = useState(false);
    const [translateWord, setTranslateWord] = useState(false);
    const [inputSentenceAddNumber, setInputSentenceAddNumber] = useState(false);
    const [translateWordAddNumber, setTranslateWordAddNumber] = useState(false);
    const [content, setContent] = useState({});
    const [contentTabAddNumber, setContentTabAddNumber] = useState(true);
    const [contentTabOriginal, setContentTabOriginal] = useState(false);
    

    useEffect(() => {
        if(inputText){
            setInputTextCount(inputText.length);
        }
        if(inputSentence && translateWord){
            const original = inputSentence.split(' ');
            const translation = translateWord.data.split(' ');
            const arrOriginal = []
            const arrTranslation = []
            for (var i = 0; i < original.length; i++) {
                arrOriginal.push("[" + String(i+1) + "]" + original[i]);
                arrTranslation.push("[" + String(i+1) + "]" + translation[i]);
            }
            setInputSentenceAddNumber(arrOriginal.join(' '));
            setTranslateWordAddNumber(arrTranslation.join(' '));
        }
        if(contentTabOriginal){
            setContent({
                originalText: inputSentence,
                translateText: translateSentence.data
            });
        } else if(contentTabAddNumber){
            setContent({
                originalText: inputSentenceAddNumber,
                translateText: translateWordAddNumber
            });
        }
    },[inputText, inputSentence, translateWord, content]);

    const translateClick = () => {
        const fetchSentence = async (req,res) => {
            if(inputText.length >= 1 && inputText.length <= 200){
                setInputTextErorr("")
                setInputSentence(inputText);
                const sentenceTranslate = await axios.get(`/translation/translate/sentence?sentence=${ inputText }`);
                const wordTranslate = await axios.get(`/translation/translate/word?sentence=${ inputText }`);
                setTranslateSentence(sentenceTranslate);
                setTranslateWord(wordTranslate)
            } else if (inputText.length >= 201) {
                setInputTextErorr("200文字以下での入力をお願いします")
            }
        };
        fetchSentence();
    };

    const handleTabClick = async (tabId) => {
        try {
            if (tabId===1){
                setContentTabAddNumber(true);
                setContentTabOriginal(false);
            } else if (tabId===2){
                setContentTabAddNumber(false);
                setContentTabOriginal(true);
            } else{
                console.log("不正な値です");
            }
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <>
            <Container>
                <Form.Group className="py-5 form-center" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className='h6'>200文字以内の文章を入力してください（外国語⇒日本語）</Form.Label>
                    <ul>
                        <li>英文推奨</li>
                        <li>翻訳の精度（特に単語ごと）が低い場合がありますがご了承ください</li>
                    </ul>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        onChange={e => setInputText(e.target.value)}
                        required
                    />
                    <div class="d-flex my-3 align-items-center">
                        <div class="flex-grow-1">
                            文字数：{inputTextCount ? inputTextCount : null}<br/>
                            {inputTextErorr ? inputTextErorr : null}
                        </div>
                        <div class="ms-auto"><Button as="input" type="submit" value="翻訳" onClick={translateClick} /></div>
                    </div>
                </Form.Group>
                <div class="card text-center">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <a className={`nav-link ${contentTabAddNumber ? 'active' : null}`}href="#" onClick={() => handleTabClick(1)}>単語ごと</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${contentTabOriginal ? 'active' : null}`} href="#" onClick={() => handleTabClick(2)}>全文翻訳</a>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        {translateWordAddNumber ?
                            <>
                                <p className="h6 card-text">{content ? content.originalText : null}</p>
                                <p className="h6 card-text">{content ? content.translateText : null}</p>
                            </> :
                            <p className="h6 card-text">翻訳したい文章を入力してください</p>
                        }
                    </div>
                </div>
            </Container>
        </>
    )
}
