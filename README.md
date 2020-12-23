# Formal Letter Generator

## Description

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This React application takes in a user's information such as name and address and then uses that information to generate a formal letter. All letters generated contain the same bulk text except for specific areas in the letter such as where a name and address would typically go.

Address information is filtered and returned using a geolocation API that presents a list of valid addresses in which the user can select. There is also the option to go back and re-enter information if there was a mistake using a button located at the bottom of the generated letter.

## Installation

Fork this project and run `npm install` within your terminal. It should install all needed dependencies within `package.json`.

### Note:

This project requires Node v14 and above as well as the `testing-library/jest-dom`, `testing-library/react`, and `testing-library/user-event` dependencies. Testing also requires a dev dependency of `react-test-renderer`.

## Usage

Coming soon...

## Support

Contact me on Twitter @kyle_w_code or leave a Git issue.

## License
[MIT License](https://choosealicense.com/licenses/mit/#)

## Project Status

I am currently moving the geolocation API from PositionStack to some other service due to an issue with the free service of PositionStack only offering the endpoint over http://. This leads to the 'mixed content' error.
