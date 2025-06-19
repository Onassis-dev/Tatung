const traductions = {
  code: 'codigo',
  name: 'nombre',
  description: 'descripcion',
  created_at: 'creado el',
  ip: 'ip',
  display: 'pantalla',
  line: 'linea',
  model: 'modelo',
  part: 'parte',
  turn: 'turno',
  day: 'dia',
};

export default function traduce(key: string): string {
  return traductions[key as keyof typeof traductions] || key;
}
