import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraficoEvidencia() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Ejecutados',
        data: [12, 19, 3, 5, 2],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Pendientes',
        data: [2, 3, 20, 5, 1],
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Fallidos',
        data: [3, 10, 13, 15, 22],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (

    <Box>
      <Line data={data} options={options} />
    </Box>
  );
}
