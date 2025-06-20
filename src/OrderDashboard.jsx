import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import alert from './assets/alert.mp3';

const socket = io('https://hayas-backend.onrender.com');

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const ringingOrders = useRef(new Set());
  const audioRef = useRef(null);

  useEffect(() => {
    fetchOrders();

    socket.on('new-order', (data) => {
      setOrders(prev => [data.order, ...prev]);
      ringingOrders.current.add(data.order._id);
      playSound();
    });

    socket.on('order-status-updated', (data) => {
      setOrders(prev =>
        prev.map(order => order._id === data.order._id ? data.order : order)
      );
      if (ringingOrders.current.has(data.order._id)) {
        ringingOrders.current.delete(data.order._id);
        if (ringingOrders.current.size === 0) stopSound();
      }
    });

    return () => {
      socket.off('new-order');
      socket.off('order-status-updated');
      stopSound();
    };
  }, [audioAllowed]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://hayas-backend.onrender.com/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`https://hayas-backend.onrender.com/orders/${id}/status`, { status });
      ringingOrders.current.delete(id);
      if (ringingOrders.current.size === 0) stopSound();
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const playSound = () => {
    if (audioAllowed && audioRef.current && audioRef.current.paused) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(err => console.warn('Audio play failed:', err));
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleAudio = () => {
    setAudioAllowed(prev => {
      const next = !prev;
      if (next) {
        audioRef.current?.play().catch(err => console.warn('Initial play blocked:', err));
      } else {
        stopSound();
      }
      return next;
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Admin Order Dashboard</h2>

      <div style={styles.switchContainer}>
        <label style={styles.switchLabel}>
          <input type="checkbox" checked={audioAllowed} onChange={toggleAudio} />
          {/* <span style={styles.slider}></span> */}
        </label>
        <span style={{ marginLeft: '0.5rem' }}>Sound Alerts {audioAllowed ? 'On' : 'Off'}</span>
      </div>

      <audio ref={audioRef} src={alert} preload="auto" />

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={styles.card}>
            <div style={styles.section}>
              <strong>📧 Email:</strong> {order.userEmail}<br />
              <strong>🕒 Time:</strong> {new Date(order.createdAt).toLocaleString()}<br />
              <strong>📌 Status:</strong> <span style={{ color: statusColor(order.status) }}>{order.status}</span>
            </div>

            <div style={styles.section}>
              <strong>📍 Address:</strong><br />
              {order.address.name} | {order.address.phone}<br />
              {order.address.street}, {order.address.area}
            </div>

            <div style={styles.section}>
              <strong>🛒 Products:</strong>
              <ul style={styles.list}>
                {order.products.map((p, idx) => (
                  <li key={idx}>
                    {p.title} — {p.count} x {p.quantityOne} {p.quantityType}
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.actions}>
              <button onClick={() => updateStatus(order._id, 'CONFIRMED')} style={styles.btnGreen}>Confirm</button>
              <button onClick={() => updateStatus(order._id, 'CANCELLED')} style={styles.btnRed}>Cancel</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const statusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'orange';
    case 'CONFIRMED': return 'green';
    case 'CANCELLED': return 'red';
    default: return 'black';
  }
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '1rem'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  switchLabel: {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '24px'
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    borderRadius: '24px',
    transition: '0.4s',
    before: {
      content: '""',
      position: 'absolute',
      height: '18px',
      width: '18px',
      left: '4px',
      bottom: '3px',
      backgroundColor: 'white',
      transition: '0.4s',
      borderRadius: '50%'
    }
  },
  card: {
    background: '#fff',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '0.75rem',
    fontSize: '0.95rem'
  },
  list: {
    margin: 0,
    paddingLeft: '1rem'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  btnGreen: {
    backgroundColor: 'green',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px'
  },
  btnRed: {
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px'
  }
};

export default OrderDashboard;
