import React, { useState, useEffect } from 'react';

const TimeSince = ({ publishTime }) => {
  const [timeSince, setTimeSince] = useState('');

  useEffect(() => {
    const calculateTimeSince = () => {
      const currentTime = new Date();
      const publishedTime = new Date(publishTime);

      const differenceInSeconds = Math.floor((currentTime - publishedTime) / 1000);

      const intervals = {
        year: Math.floor(differenceInSeconds / (365 * 24 * 60 * 60)),
        month: Math.floor(differenceInSeconds / (30 * 24 * 60 * 60)),
        day: Math.floor(differenceInSeconds / (24 * 60 * 60)),
        hour: Math.floor(differenceInSeconds / (60 * 60)),
        minute: Math.floor(differenceInSeconds / 60),
        second: differenceInSeconds,
      };

      let result = '';

      if (intervals.year > 0) {
        result = `${intervals.year} ${intervals.year === 1 ? 'year' : 'years'}`;
      } else if (intervals.month > 0) {
        result = `${intervals.month} ${intervals.month === 1 ? 'month' : 'months'}`;
      } else if (intervals.day > 0) {
        result = `${intervals.day} ${intervals.day === 1 ? 'day' : 'days'}`;
      } else if (intervals.hour > 0) {
        result = `${intervals.hour} ${intervals.hour === 1 ? 'hour' : 'hours'}`;
      } else if (intervals.minute > 0) {
        result = `${intervals.minute} ${intervals.minute === 1 ? 'minute' : 'minutes'}`;
      } else {
        result = `${intervals.second} ${intervals.second === 1 ? 'second' : 'seconds'}`;
      }

      setTimeSince(result);
    };

    calculateTimeSince();
  }, [publishTime]);

  return <span>{timeSince} ago</span>;
};

export default TimeSince;
