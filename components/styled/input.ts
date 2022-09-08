import styled from "styled-components";

export const Input = styled.input`
    border: none;
    -webkit-box-shadow: 0 4px 14px 0 rgb(0 0 0 / 20%);
    -webkit-appearance: none;
    color: #3c005a;    
    border-radius: 10px;
    font-size: 20px;
    padding: 15px;
    font-family: monospace;
    margin-bottom: 20px;
    width: calc(100% - 30px);
    max-width: 500px;

    ::-webkit-input-placeholder {
        opacity: 0.5;
        font-size: 17.5px;
    }

    &:focus {
        outline: none;
        -webkit-box-shadow: 0 4px 25px 0 rgb(60 0 90 / 25%);
    }
`;