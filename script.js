/* Configure your personal and project links here. Leave a value empty until it is ready. */
const PORTFOLIO_LINKS = {
  email: 'anbuselvi204199@gmail.com',
  linkedin: 'www.linkedin.com/in/anbuselvi-aandisamy-537388186',
  github: 'https://github.com/Anbuselvi20',
  phone: '8939367768',
  resume: 'Anbuselvi_SpringBoot_Microservices_Resume_pdf.pdf',
  hotelProject: '',
  paymentProject: '',
  portalProject: ''
};

const endpointSelect = document.querySelector('#endpoint-select');
const requestBody = document.querySelector('#request-body');
const bodyHint = document.querySelector('#body-hint');
const apiForm = document.querySelector('#api-form');
const responseOutput = document.querySelector('#response-output');
const responseStatus = document.querySelector('#response-status');
const bookingPayload = `{
  "hotelId": "HTL-104",
  "checkIn": "2026-11-10",
  "checkOut": "2026-11-13",
  "guests": 2
}`;
const emptyPayload = `{
  "hotelId": "HTL-104",
  "city": "Chennai"
}`;

function setConfiguredLinks() {
  document.querySelectorAll('[data-link]').forEach((link) => {
    const value = PORTFOLIO_LINKS[link.dataset.link];
    if (!value) return;

    if (link.dataset.link === 'email') {
      link.href = `mailto:${value}`;
    } else if (link.dataset.link === 'phone') {
      link.href = `tel:${value.replace(/[^\d+]/g, '')}`;
    } else if (link.dataset.link === 'linkedin' && !/^https?:\/\//i.test(value)) {
      link.href = `https://${value}`;
    } else {
      link.href = value;
    }
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
    if (link.dataset.link === 'email' || link.dataset.link === 'phone') {
      link.querySelector('strong').textContent = value;
    } else {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      if (link.dataset.link === 'linkedin' || link.dataset.link === 'github') {
        link.querySelector('strong').textContent = 'Open profile';
      } else if (link.dataset.link === 'resume') {
        link.querySelector('strong').textContent = 'View resume';
      } else if (link.dataset.link !== 'phone') {
        link.querySelector('strong').textContent = 'View project';
      }
    }
  });
}

function setResponse(status, payload, isError = false) {
  responseStatus.textContent = status;
  responseStatus.classList.toggle('status-ok', !isError);
  responseStatus.classList.toggle('status-error', isError);
  responseOutput.textContent = JSON.stringify(payload, null, 2);
}

function updateEndpointForm() {
  const isBooking = endpointSelect.value === 'booking';
  requestBody.disabled = !isBooking;
  requestBody.value = isBooking ? bookingPayload : emptyPayload;
  bodyHint.textContent = isBooking
    ? 'Example booking payload. Edit values to see validation responses.'
    : 'This GET request has no body. The sample JSON is shown for context only.';
}

function simulateRequest(event) {
  event.preventDefault();
  const endpoint = endpointSelect.value;

  if (endpoint === 'search') {
    setResponse('200 OK · SIMULATED', {
      results: [
        { hotelId: 'HTL-104', name: 'Harbour View Hotel', city: 'Chennai' },
        { hotelId: 'HTL-208', name: 'Garden Court', city: 'Chennai' }
      ],
      source: 'sample data'
    });
    return;
  }

  if (endpoint === 'availability') {
    setResponse('200 OK · SIMULATED', {
      hotelId: 'HTL-104',
      dateRange: { checkIn: '2026-11-10', checkOut: '2026-11-13' },
      roomsAvailable: 4,
      source: 'sample data'
    });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(requestBody.value);
  } catch {
    setResponse('400 BAD REQUEST · SIMULATED', {
      error: 'Invalid JSON',
      message: 'Check the request body syntax and try again.'
    }, true);
    return;
  }

  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    setResponse('400 BAD REQUEST · SIMULATED', {
      error: 'Invalid booking payload',
      message: 'The request body must be a JSON object.'
    }, true);
    return;
  }

  const requiredFields = ['hotelId', 'checkIn', 'checkOut', 'guests'];
  const missingFields = requiredFields.filter((field) => (
    payload[field] === undefined
    || payload[field] === null
    || (typeof payload[field] === 'string' && payload[field].trim() === '')
  ));
  if (missingFields.length > 0) {
    setResponse('400 BAD REQUEST · SIMULATED', {
      error: 'Validation failed',
      missingFields
    }, true);
    return;
  }

  if (typeof payload.hotelId !== 'string') {
    setResponse('400 BAD REQUEST · SIMULATED', {
      error: 'Validation failed',
      message: 'hotelId must be a non-empty string.'
    }, true);
    return;
  }

  const isValidDate = (value) => (
    typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(value))
    && new Date(value).toISOString().slice(0, 10) === value
  );
  if (!isValidDate(payload.checkIn) || !isValidDate(payload.checkOut)) {
    setResponse('400 BAD REQUEST · SIMULATED', {
      error: 'Validation failed',
      message: 'checkIn and checkOut must be valid dates in YYYY-MM-DD format.'
    }, true);
    return;
  }

  if (Date.parse(payload.checkOut) <= Date.parse(payload.checkIn)) {
    setResponse('400 BAD REQUEST · SIMULATED', {
      error: 'Validation failed',
      message: 'checkOut must be after checkIn.'
    }, true);
    return;
  }

  if (!Number.isInteger(payload.guests) || payload.guests < 1) {
    setResponse('400 BAD REQUEST · SIMULATED', {
      error: 'Validation failed',
      message: 'guests must be a positive whole number.'
    }, true);
    return;
  }

  setResponse('201 CREATED · SIMULATED', {
    bookingId: 'DEMO-BKG-0001',
    status: 'CONFIRMED',
    hotelId: payload.hotelId,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    guests: payload.guests,
    note: 'Illustrative response. No booking was created.'
  });
}

const emitButton = document.querySelector('#emit-event');
const eventState = document.querySelector('#event-state');
const eventLog = document.querySelector('#event-log');
const flowStages = [...document.querySelectorAll('.flow-stage')];
const flowConnectors = [...document.querySelectorAll('.flow-connector')];
let eventSequence = 0;
let flowIsRunning = false;

function appendEventLog(message, isSuccess = false) {
  const placeholder = eventLog.querySelector('.log-placeholder');
  if (placeholder) placeholder.remove();
  const entry = document.createElement('p');
  const clock = new Date();
  const timestamp = [clock.getHours(), clock.getMinutes(), clock.getSeconds()]
    .map((part) => String(part).padStart(2, '0')).join(':');
  const time = document.createElement('span');
  time.className = 'log-time';
  time.textContent = timestamp;
  const detail = document.createElement('span');
  if (isSuccess) detail.className = 'log-ok';
  detail.textContent = message;
  entry.append(time, detail);
  eventLog.append(entry);
  while (eventLog.children.length > 5) eventLog.firstElementChild.remove();
}

function pause(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

async function emitSampleEvent() {
  if (flowIsRunning) return;
  flowIsRunning = true;
  emitButton.disabled = true;
  eventSequence += 1;
  const eventId = `demo-${String(eventSequence).padStart(3, '0')}`;
  flowStages.forEach((stage) => stage.classList.remove('active', 'complete'));
  flowConnectors.forEach((connector) => connector.classList.remove('running'));
  eventState.textContent = 'PROCESSING';
  appendEventLog(`${eventId} booking.created queued`, false);

  for (let index = 0; index < flowStages.length; index += 1) {
    flowStages[index].classList.add('active');
    await pause(470);
    flowStages[index].classList.remove('active');
    flowStages[index].classList.add('complete');
    if (index < flowConnectors.length) {
      flowConnectors[index].classList.add('running');
      await pause(310);
      flowConnectors[index].classList.remove('running');
    }
  }

  eventState.textContent = 'COMPLETE';
  appendEventLog(`${eventId} processed by consumer · demo only`, true);
  emitButton.disabled = false;
  flowIsRunning = false;
}

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
  primaryNav.classList.toggle('is-open', !isExpanded);
});

primaryNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    primaryNav.classList.remove('is-open');
  }
});

apiForm.addEventListener('submit', simulateRequest);
endpointSelect.addEventListener('change', updateEndpointForm);
emitButton.addEventListener('click', emitSampleEvent);
document.querySelector('#current-year').textContent = String(new Date().getFullYear());
setConfiguredLinks();
updateEndpointForm();

if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  observedSections.forEach((section) => observer.observe(section));
}
