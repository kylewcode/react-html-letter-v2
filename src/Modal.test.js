import { prettyDOM, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import App from './App';
import Modal from "./Modal";

// FEATURE: Input validation
// SCENARIO: A user enters their info including a valid address into the form and submits
//  GIVEN that the app is ready to recieve input and the form is displayed 
//  WHEN the user fills out the form and submits
//  THEN a list of selectable valid (not null) addresses should appear including an option for 'no addresses found'

it('displays a list of valid selectable addresses', () => {
    render(<App />);

    // User input variables
    const userInput = {
        firstName: 'Kyle',
        lastName: 'Williams',
        streetNumber: '10308',
        streetName: 'Kennebec Ct',
        aptSuite: 'n/a',
        city: 'Orlando',
        state: 'Florida',
        zipcode: '32817',
        date: '2020-11-30',
        gender: 'Male',
        married: 'No',
    };
    
    // Here I need to simulate user entering info and submitting the form
    // First name
    const firstNameEl = screen.getByRole('textbox', {name: 'Enter your first name'});
    userEvent.type(firstNameEl, userInput.firstName);
    expect(firstNameEl).toHaveValue(userInput.firstName);

    // Last name
    const lastNameEl = screen.getByRole('textbox', {name: 'Enter your last name'});
    userEvent.type(lastNameEl, userInput.lastName);
    expect(lastNameEl).toHaveValue(userInput.lastName);

    // Street number
    const streetNumberEl = screen.getByRole('textbox', {name: 'Enter street number'});
    userEvent.type(streetNumberEl, userInput.streetNumber);
    expect(streetNumberEl).toHaveValue(userInput.streetNumber);

    // Street name
    const streetNameEl = screen.getByRole('textbox', {name: 'Enter street name'});
    userEvent.type(streetNameEl, userInput.streetName);
    expect(streetNameEl).toHaveValue(userInput.streetName);

    // Apt or Suite
    const aptSuiteEl = screen.getByRole('textbox', {name: 'Enter Apt/Suite'});
    userEvent.type(aptSuiteEl, userInput.aptSuite);
    expect(aptSuiteEl).toHaveValue(userInput.aptSuite);

    // City
    const cityEl = screen.getByRole('textbox', {name: 'Enter city'});
    userEvent.type(cityEl, userInput.city);
    expect(cityEl).toHaveValue(userInput.city);

    // State
    const stateEl = screen.getByRole('combobox', {name: 'Select state'});
    userEvent.selectOptions(stateEl, userInput.state);
    expect(stateEl).toHaveValue(userInput.state);

    // Zip
    const zipEl = screen.getByRole('textbox', {name: 'Enter zipcode'});
    userEvent.type(zipEl, userInput.zipcode);
    expect(zipEl).toHaveValue(userInput.zipcode);

    // Date
    const dateEl = screen.getByLabelText('Enter date');
    userEvent.type(dateEl, userInput.date);
    expect(dateEl).toHaveValue(userInput.date);

    // Gender
    const genderEl = screen.getByRole('radio', {name: userInput.gender});
    userEvent.click(genderEl);
    expect(genderEl).toBeChecked();

    // Married?
    const marriedEl = screen.getByRole('radio', {name: 'No'});
    userEvent.click(marriedEl);
    expect(marriedEl).toBeChecked();
    // userEvent.click(screen.getByRole('button', {name: 'Submit'}));
});

// Test the modal here with mock API data

// FEATURE: Input validation
// SCENARIO: A user enters their info including an invalid address into the form and submits