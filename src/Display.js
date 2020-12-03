import React from 'react';
import './App.css';

function Display({
    displaySetState,
    displayState: {
      firstName,
      lastName,
      streetNumber,
      streetName,
      aptSuite,
      city,
      stateName,
      zipcode,
      date,
      isFemale,
      isMarried,
      status,
      dataStore,
    },
  }) {
    const childState = {
      firstName,
      lastName,
      streetNumber,
      streetName,
      aptSuite,
      city,
      stateName,
      zipcode,
      date,
      isFemale,
      isMarried,
      status,
      dataStore,
    };

    const namePrefix = () => {
      if (isFemale && isMarried) return "Mrs.";
      if (isFemale && !isMarried) return "Ms.";
      return "Mr.";
    };

    function handleClick() {
      displaySetState({ ...childState, status: "fillingOutForm" });
    }

    return (
      <div>
        <address className="sender-column">
          <p>
            <b>Dr. Eleanor Gaye</b> <br />
            Awesome Science faculty <br />
            University of Awesome <br />
            Bobtown, CA 99999, <br />
            USA <br />
            <b>Tel</b>: 123-456-7890 <br />
            <b>Email</b>: no_reply@example.com
          </p>
        </address>
        <div className="sender-column">
    <time dateTime="2016-01-20">{date}</time>
        </div>
        <address>
          <p>
            <b>
              {namePrefix()} {firstName} {lastName}
            </b>
            <br />
            {streetNumber} {streetName} {aptSuite ? `#${aptSuite}` : null}
            <br />
            {city}, {stateName} {zipcode}
            <br />
            USA
          </p>
        </address>

        <h1>
          Re: {namePrefix()} {firstName} {lastName} university application
        </h1>

        <p>
          Dear {firstName},
          <br />
          <br />
          Thank you for your recent application to join us at the University
          of Awesome's science faculty to study as part of your
          <abbr title="A doctorate in any discipline except medicine, or sometimes theology.">
            {" "}
            PhD{" "}
          </abbr>
          next year. I will answer your questions one by one, in the
          following sections.
        </p>

        <h2>Starting dates</h2>

        <p>
          We are happy to accommodate you starting your study with us at any
          time, however it would suit us better if you could start at the
          beginning of a semester; the start dates for each one are as
          follows:
        </p>

        <ul>
          <li>
            First semester:{" "}
            <time dateTime="2016-09-09">9 September 2016</time>
          </li>
          <li>
            Second semester:{" "}
            <time dateTime="2016-01-15">15 January 2017</time>
          </li>
          <li>
            Third semester: <time dateTime="2017-05-02">2 May 2017</time>
          </li>
        </ul>
        <p>
          Please let me know if this is ok, and if so which start date you
          would prefer.
          <br />
          <br />
          You can find more information about{" "}
          <a href="http://example.com." target="_blank" rel="noreferrer">
            important university dates
          </a>
          on our website.
        </p>

        <h2>Subjects of study</h2>

        <p>
          At the Awesome Science Faculty, we have a pretty open-minded
          research facility — as long as the subjects fall somewhere in the
          realm of science and technology. You seem like an intelligent,
          dedicated researcher, and <strong>just </strong>
          the kind of person we'd like to have on our team. Saying that, of
          the ideas you submitted we were most intrigued by are as follows,
          in order of priority:
        </p>
        <ul>
          <li>
            Turning H<sub>2</sub>0 into wine, and the health benefits of
            Resveratrol (C<sub>14</sub>H<sub>12</sub>O<sub>3</sub>.)
          </li>
          <li>
            Measuring the effect on performance of funk bassplayers at
            temperatures exceeding 30°C (86°F), when the audience size
            exponentially increases (effect of 3 × 10<sup>3</sup>
            increasing to 3 × 10<sup>4</sup>.)
          </li>
          <li>
            <abbr title="HyperText Markup Language">HTML</abbr> and{" "}
            <abbr title="Cascading Style Sheets">CSS </abbr>
            constructs for representing musical scores.
          </li>
        </ul>
        <p>
          So please can you provide more information on each of these
          subjects, including how long you'd expect the research to take,
          required staff and other resources, and anything else you think
          we'd need to know? Thanks.
        </p>

        <h2>Exotic dance moves</h2>

        <p>
          Yes, you are right! As part of my post-doctorate work, I{" "}
          <em>did</em> study exotic tribal dances. To answer your question,
          my favourite dances are as follows, with definitions:
        </p>

        <dl>
          <dt>Polynesian chicken dance</dt>
          <dd>
            A little known but very influential dance dating back as far as
            300<abbr title="Before Christ">BC</abbr>, a whole village would
            dance around in a circle like chickens, to encourage their
            livestock to be "fruitful".
          </dd>
          <dt>Icelandic brownian shuffle</dt>
          <dd>
            Before the Icelanders developed fire as a means of getting warm,
            they used to practice this dance, which involved huddling close
            together in a circle on the floor, and shuffling their bodies
            around in imperceptibly tiny, very rapid movements. One of my
            fellow students used to say that he thought this dance inspired
            modern styles such as Twerking.
          </dd>
          <dt>Arctic robot dance</dt>
          <dd>
            An interesting example of historic misinformation, English
            explorers in the 1960s believed to have discovered a new dance
            style characterized by "robotic", stilted movements, being
            practiced by inhabitants of Northern Alaska and Canada. Later on
            however it was discovered that they were just moving like this
            because they were really cold.
          </dd>
        </dl>
        <p>
          For more of my research, see my{" "}
          <a href="http://example.com." target="_blank" rel="noreferrer">
            exotic dance research page
          </a>
          .
          <br />
          <br />
          Yours sincerely,
          <br />
          <br />
          Dr Eleanor Gaye
          <br />
          <br />
          University of Awesome motto: <q>
            Be awesome to each other.
          </q> --
          <cite>
            The memoirs of Bill S Preston,
            <abbr title="An abbreviation for esquire."> Esq</abbr>
          </cite>
        </p>
        <div className="return-button">
          <h3>Made a mistake?</h3>
          <button onClick={handleClick}>Click to return to form</button>
        </div>
      </div>
    );
  }

  export default Display;