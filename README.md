# react-cool-calendar

An events calendar component built for React and made for modern browsers (read: not IE) and uses flexbox over the classic tables-caption approach.

## Use and Setup

`yarn add react-coo-calendar` or `npm install --save react-coo-calendar`

Make sure your calendar's container element has a height, or the calendar won't be visible

```js
<div style={{ width: '100vw', height: '100vh', padding: '24px' }}>
  <Calendar
    duration={15 * 3600}
    timeType={24}
    groupTime={60 * 3600}
    nowIndicator={true}
    viewMode={'WEEK'}
    dateFormat="MM/DD/YYYY"
    datetimeFormat="MM DD YYYY hh:mm:ss"
    timeFormat="hh:mm:ss"
    locale="en"
    workingTime={{
      start: 7 * 3600,
      end: 20 * 3600,
    }}
    dayTime={{
      start: 0 * 3600,
      end: 24 * 3600,
    }}
    appointments={[
      {
        id: '1',
        startTime: 7 * 3600,
        duration: 120,
        title: '1',
        content: 'You only live once',
        status: EStatus.BOOKED,
        createdAt: dayjs(),
      },
      {
        id: '2',
        startTime: 8 * 3600,
        duration: 200,
        title: '2',
        content: 'You only live once',
        status: EStatus.CONFIRMED,
        createdAt: dayjs(),
      },
    ]}
  />
</div>
```

### Localization and Date Formatting

`react-cool-calendar` uses [Day.js](https://day.js.org) for handling the date formatting and culture localization.

## Custom Styling
