import { render, screen } from "@testing-library/react";
import App from './App';
import Modal from "./Modal";

// FEATURE: Input validation
// SCENARIO: A user enters their info including a valid address into the form and submits
//  GIVEN that the app is ready to recieve input and the form is displayed 
//  WHEN the user fills out the form and submits
//  THEN a list of selectable valid (not null) addresses should appear including an option for 'no addresses found'

it('displays a list of valid selectable addresses', () => {
    // render(<App />);
    // Here I need to simulate user entering info and submitting the form
    
    // render(<Modal />); Currently has an error because the state is not being passed to Modal from App.
});

// FEATURE: Input validation
// SCENARIO: A user enters their info including an invalid address into the form and submits