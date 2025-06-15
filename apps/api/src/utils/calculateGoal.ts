interface Props {
  employees: number;
  time: number;
}

export function calculateGoal(props: Props) {
  if (!props) return;
  const { employees, time } = props;

  const minutesPerDay = 60 * 8;
  const goal = (employees * minutesPerDay) / time;
  return goal;
}
