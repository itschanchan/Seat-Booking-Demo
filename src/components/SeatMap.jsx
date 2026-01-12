import './SeatMap.css';
import { useEffect, useState } from 'react';

const ROW_PRICES = { A: 12000, B: 5000, C: 2500, D: 450 };

function generateSeats() {
  const rows = ['A', 'B', 'C', 'D'];
  let id = 1;
  return rows.flatMap((row) =>
    Array.from({ length: 8 }, (_, i) => ({
      id: id++,
      row_label: row,
      seat_number: i + 1,
      price: ROW_PRICES[row],
      is_booked: Math.random() < 0.25,
      booked_by: null, // store user's name
    }))
  );
}

export default function SeatMap() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // multiple selections

  useEffect(() => {
    setSeats(generateSeats());
  }, []);

  const availableCount = seats.filter((s) => !s.is_booked).length;
  const bookedCount = seats.filter((s) => s.is_booked).length;
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  function resetSeats() {
    setSeats(generateSeats());
    setSelectedSeats([]);
  }

  function selectSeat(seat) {
    if (seat.is_booked) return;

    const name = prompt(`Enter your name to select seat ${seat.row_label}${seat.seat_number}:`);
    if (!name) return;

    setSeats((prev) =>
      prev.map((s) =>
        s.id === seat.id ? { ...s, booked_by: name } : s
      )
    );

    setSelectedSeats((prev) => [...prev, { ...seat, booked_by: name }]);
  }

  function confirmCheckout(seat) {
    setSeats((prev) =>
      prev.map((s) =>
        s.id === seat.id ? { ...s, is_booked: true } : s
      )
    );

    setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    alert(`Seat ${seat.row_label}${seat.seat_number} successfully booked for ₱${seat.price} by ${seat.booked_by}`);
  }

  const groupedSeats = seats.reduce((acc, seat) => {
    acc[seat.row_label] ||= [];
    acc[seat.row_label].push(seat);
    return acc;
  }, {});

  return (
    <div className="seatmap-container">
      <div className="seatmap-grid">

        {/* LEFT: Seat Map */}
        <div className="panel">
          <div className="header">
            <div>
              <h1>Seat Booking</h1>
              <p>Choose your seat • Prices in PHP</p>
            </div>
            <button className="btn" onClick={resetSeats}>Reset Seats</button>
          </div>

          {/* Counters */}
          <div className="counter-grid">
            <div className="counter counter-available">
              <p>Available</p>
              <p>{availableCount}</p>
            </div>
            <div className="counter counter-booked">
              <p>Booked</p>
              <p>{bookedCount}</p>
            </div>
          </div>

          {/* Stage */}
          <div className="stage">STAGE</div>

          {/* Seats */}
          <div>
            {Object.keys(groupedSeats).map((row) => (
              <div key={row} className="seat-row">
                <span className="row-label">{row}</span>
                <div className="seat-buttons">
                  {groupedSeats[row].map((seat) => {
                    const isSelected = selectedSeats.some(s => s.id === seat.id);

                    return (
                      <button
                        key={seat.id}
                        onClick={() => selectSeat(seat)}
                        disabled={seat.is_booked}
                        className={`seat-btn ${
                          seat.is_booked
                            ? 'booked'
                            : isSelected
                            ? 'selected'
                            : 'available'
                        }`}
                        data-tooltip={
                          seat.is_booked
                            ? `Seat ${seat.row_label}${seat.seat_number}\n₱${seat.price}\nBooked by: ${seat.booked_by}`
                            : isSelected
                            ? `Seat ${seat.row_label}${seat.seat_number}\n₱${seat.price}\nSelected by: ${seat.booked_by}`
                            : `Seat ${seat.row_label}${seat.seat_number}\n₱${seat.price}\nAvailable`
                        }
                      >
                        {seat.seat_number}
                      </button>
                    );
                  })}
                </div>
                <span className="row-price">₱{ROW_PRICES[row]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Selected Seats */}
        <div className="panel">
          <h2>Selected Seats</h2>

          {selectedSeats.length === 0 && <p>No seats selected yet</p>}

          {selectedSeats.map((seat) => (
            <div
              key={seat.id}
              className="selected-seat-item"
            >
              <span>
                {seat.row_label}{seat.seat_number} — ₱{seat.price}
                <br />
                <small>Booked by: {seat.booked_by}</small>
              </span>

              <button
                className="modal-btn confirm"
                onClick={() => confirmCheckout(seat)}
              >
                Confirm
              </button>
            </div>
          ))}

          {/* TOTAL */}
          {selectedSeats.length > 0 && (
            <div className="total-price">
              <strong>Total:</strong> ₱{totalPrice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
