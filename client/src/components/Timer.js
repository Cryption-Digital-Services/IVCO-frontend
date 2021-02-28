import React from "react";
import Countdown from "react-countdown";
import styled from "styled-components";

export const renderer = ({ days, hours, minutes, seconds, completed }) => {
  // if (completed) return <div>The Presale has started</div>;
  // else
  return (
    <CountDownContainer>
      <div>
        {days != 0 ? (
          <LabelContainer>
            {days}
            <Labels>days</Labels>
          </LabelContainer>
        ) : (
          ""
        )}

        <LabelContainer>
          {hours}
          <Labels>hrs</Labels>
        </LabelContainer>
        <LabelContainer>
          {minutes}
          <Labels>mins</Labels>
        </LabelContainer>
        <LabelContainer>
          {seconds}
          <Labels>secs</Labels>
        </LabelContainer>
      </div>
    </CountDownContainer>
  );
};

export const Timer = ({ unixtime }) => {
  // const unixDate = 111111111111;
  // window.alert(unixtime);
  let actualDate = new Date(parseFloat(unixtime) * 1000).toLocaleDateString(
    "en-US"
  );
  // window.alert(unixtime);
  // window.alert(Math.round(new Date().getTime() / 1000));

  return (
    <TimerContainer>
      the preslae will end in
      <Countdown date={actualDate} renderer={renderer} />
    </TimerContainer>
  );
};
const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #1a1b23;
  /* grid-area: 4 / 5 / 7 / 6; */
  grid-area: timer;
  border-radius: 6px;
`;

const CountDownContainer = styled.div``;

const Labels = styled.span`
  margin-left: 5px;
  color: #8888;
`;

const LabelContainer = styled.span`
  margin: 0 5px;
`;
