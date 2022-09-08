import styled from "styled-components";

export const Textarea = styled.textarea`
    border: none;
    -webkit-box-shadow: 0 4px 14px 0 rgb(0 0 0 / 20%);
    -webkit-appearance: none;
    color: #3c005a;    
    border-radius: 10px;
    font-size: 20px;
    padding: 15px;
    max-width: 500px;
    width: calc(100% - 30px);
    font-family: monospace;
    margin-bottom: 20px;
    resize: none;

    ::-webkit-input-placeholder {
        opacity: 0.5;
        font-size: 17.5px;
    }

    &:focus {
        outline: none;
        -webkit-box-shadow: 0 4px 25px 0 rgb(60 0 90 / 25%);
    }
`;