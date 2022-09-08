import styled from "styled-components";


export const Button = styled.button`
    background-color: #3c005a;
    color: white;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    margin-top: 30px;
    width: 100%;
    max-width: 530px;
    padding: 10px;
    font-size: 20px;
    font-weight: bold;
    font-family: monospace;
    -webkit-box-shadow: 0 4px 14px 0 rgb(0 0 0 / 20%);
    -webkit-appearance: none;

    &:disabled {
        opacity: 0.75;
        cursor: initial;
    }
`;