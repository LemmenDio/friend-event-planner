import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, Plus, X, Clock, MapPin, Users, Palette } from 'lucide-react';
import io from 'socket.io-client';
import './index.css';

const socket = io('http://localhost:3001');

function App() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    location: '',
    color: '#3b82f6'
  });

  useEffect(() => {
    // Listen for real-time updates
    socket.on('events', (serverEvents) => {
      setEvents(serverEvents);
    });

    socket.on('eventAdded', (newEvent) => {
      setEvents(prev => [...prev, newEvent]);
    });

    socket.on('eventUpdated', (updatedEvent) => {
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
    });

    socket.on('eventDeleted', (eventId) => {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    });

    return () => {
      socket.off('events');
      socket.off('eventAdded');
      socket.off('eventUpdated');
      socket.off('eventDeleted');
    };
  }, []);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setFormData({
      ...formData,
      start: arg.dateStr,
      end: arg.dateStr
    });
    setShowModal(true);
  };

  const handleEventClick = (arg) => {
    const event = events.find(e => e.id === arg.event.id);
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description || '',
        location: event.location || '',
        color: event.color || '#3b82f6'
      });
      setShowModal(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingEvent) {
      // Update existing event
      socket.emit('updateEvent', {
        id: editingEvent.id,
        ...formData
      });
    } else {
      // Add new event
      socket.emit('addEvent', formData);
    }

    // Reset form
    setFormData({
      title: '',
      start: '',
      end: '',
      description: '',
      location: '',
      color: '#3b82f6'
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const handleDelete = () => {
    if (editingEvent) {
      socket.emit('deleteEvent', editingEvent.id);
      setShowModal(false);
      setEditingEvent(null);
    }
  };

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: event.color,
    borderColor: event.color,
    extendedProps: {
      description: event.description,
      location: event.location
    }
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Friend Event Planner</h1>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            editable={true}
            droppable={true}
            height="auto"
            aspectRatio={1.8}
          />
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-backdrop fixed inset-0" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start}
                    onChange={(e) => setFormData({...formData, start: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    End
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end}
                    onChange={(e) => setFormData({...formData, end: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add location (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Add description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Color
                </label>
                <div className="flex space-x-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-900' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                {editingEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
