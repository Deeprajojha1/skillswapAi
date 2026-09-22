const steps = ['Requested', 'Confirmed', 'In progress', 'Delivered'];

export default function BookingTimeline({ current = 1 }) {
  return (
    <ol className="timeline">
      {steps.map((step, index) => (
        <li className={index <= current ? 'done' : ''} key={step}>
          <span>{index + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}
