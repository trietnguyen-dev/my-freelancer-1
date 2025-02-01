import Image from "next/image";
import TraceVisualization from "./components/TraceVisualization";

export default function Home() {
  const initialTraces = [
    {
      id: '4399c9e',
      endpoint: 'frontend: /dispatch',
      duration: 722.26,
      spans: 40,
      errors: 3,
      services: [
        { name: 'customer', count: 1, color: '#00BCD4' },
        { name: 'driver', count: 1, color: '#9E9E9E' },
        { name: 'frontend', count: 13, color: '#795548' },
        { name: 'mysql', count: 1, color: '#FF9800' },
        { name: 'redis-manual', count: 14, color: '#f44336' },
        { name: 'route', count: 10, color: '#673AB7' }
      ],
      timestamp: '9:22:57 pm'
    },
    {
      id: '8d72f3b',
      endpoint: 'frontend: /user/profile',
      duration: 245.18,
      spans: 22,
      errors: 0,
      services: [
        { name: 'frontend', count: 8, color: '#795548' },
        { name: 'auth', count: 2, color: '#2196F3' },
        { name: 'mysql', count: 2, color: '#FF9800' },
        { name: 'redis-cache', count: 4, color: '#E91E63' },
        { name: 'user-service', count: 6, color: '#4CAF50' }
      ],
      timestamp: '9:21:30 pm'
    },
    {
      id: '3ef1d2c',
      endpoint: 'frontend: /payment/process',
      duration: 892.54,
      spans: 55,
      errors: 1,
      services: [
        { name: 'frontend', count: 10, color: '#795548' },
        { name: 'payment-gateway', count: 15, color: '#9C27B0' },
        { name: 'mysql', count: 3, color: '#FF9800' },
        { name: 'redis-manual', count: 8, color: '#f44336' },
        { name: 'auth', count: 4, color: '#2196F3' },
        { name: 'notification', count: 5, color: '#009688' }
      ],
      timestamp: '9:20:15 pm'
    },
    {
      id: '9b4e7a1',
      endpoint: 'frontend: /search',
      duration: 156.72,
      spans: 18,
      errors: 0,
      services: [
        { name: 'frontend', count: 5, color: '#795548' },
        { name: 'search-service', count: 8, color: '#FFC107' },
        { name: 'redis-cache', count: 3, color: '#E91E63' },
        { name: 'elasticsearch', count: 2, color: '#607D8B' }
      ],
      timestamp: '9:19:45 pm'
    },
    {
      id: '5k9h2m4',
      endpoint: 'frontend: /order/create',
      duration: 534.91,
      spans: 35,
      errors: 2,
      services: [
        { name: 'frontend', count: 9, color: '#795548' },
        { name: 'order-service', count: 12, color: '#3F51B5' },
        { name: 'mysql', count: 4, color: '#FF9800' },
        { name: 'redis-manual', count: 6, color: '#f44336' },
        { name: 'inventory', count: 4, color: '#8BC34A' }
      ],
      timestamp: '9:18:30 pm'
    },
    {
      id: '2p7r5n8',
      endpoint: 'frontend: /notification/websocket',
      duration: 89.45,
      spans: 12,
      errors: 0,
      services: [
        { name: 'frontend', count: 4, color: '#795548' },
        { name: 'notification', count: 6, color: '#009688' },
        { name: 'redis-pubsub', count: 2, color: '#FF4081' }
      ],
      timestamp: '9:17:20 pm'
    }
  ];

  return <TraceVisualization initialTraces={initialTraces} />;
}
