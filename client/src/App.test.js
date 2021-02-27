import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import App from "./App";

// GIVEN <some current state>
// WHEN <something happens>
//    (... AND <something else happens>)
// THEN <this should be my expected result>

// FEATURE: App launch
// SCENARIO: A user launches the app.
//  GIVEN that the app is not launched
//  WHEN the user launches the app
//  THEN the form should display with all fields empty

it('renders without crashing and has empty inputs.', () => {
  render(<App />);
  const textInputs = screen.getAllByRole('textbox');
  textInputs.forEach( input => {
    expect(input).toHaveValue("");
  });
  const selectInput = screen.getByRole('combobox');
  expect(selectInput).toHaveValue('Select state');
  const dateInput = screen.getByLabelText('Date');
  expect(dateInput).toHaveValue('');
});

it('takes user input and displays the values in the form fields', () => {
  render(<App />);

  // User input variables
  const userInput = {
      firstName: 'Kyle',
      lastName: 'Williams',
      street: '10308 Kennebec Ct',
      aptSuite: '',
      city: 'Orlando',
      state: 'Florida',
      zipcode: '32817',
      date: '2020-11-30',
      title: 'Mr'
  };
  
  // Here I need to simulate user entering info and submitting the form
  // First name
  const firstNameEl = screen.getByRole('textbox', {name: 'First name'});
  userEvent.type(firstNameEl, userInput.firstName);
  expect(firstNameEl).toHaveValue(userInput.firstName);

  // Last name
  const lastNameEl = screen.getByRole('textbox', {name: 'Last name'});
  userEvent.type(lastNameEl, userInput.lastName);
  expect(lastNameEl).toHaveValue(userInput.lastName);

  // Street
  const streetEl = screen.getByRole('textbox', {name: 'Street'});
  userEvent.type(streetEl, userInput.street);
  expect(streetEl).toHaveValue(userInput.street);

  // Apt or Suite
  const aptSuiteEl = screen.getByRole('textbox', {name: 'Apt/Suite'});
  userEvent.type(aptSuiteEl, userInput.aptSuite);
  expect(aptSuiteEl).toHaveValue(userInput.aptSuite);

  // City
  const cityEl = screen.getByRole('textbox', {name: 'City'});
  userEvent.type(cityEl, userInput.city);
  expect(cityEl).toHaveValue(userInput.city);

  // State
  const stateEl = screen.getByRole('combobox', {name: 'State'});
  userEvent.selectOptions(stateEl, userInput.state);
  expect(stateEl).toHaveValue(userInput.state);

  // Zip
  const zipEl = screen.getByRole('textbox', {name: 'Zipcode'});
  userEvent.type(zipEl, userInput.zipcode);
  expect(zipEl).toHaveValue(userInput.zipcode);

  // Date
  const dateEl = screen.getByLabelText('Date');
  userEvent.type(dateEl, userInput.date);
  expect(dateEl).toHaveValue(userInput.date);

  // Title
  const titleEl = screen.getByRole('textbox', {name: "What's your title?"});
  userEvent.type(titleEl, userInput.title);
  expect(titleEl).toHaveValue(userInput.title);
});