import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'http://host.docker.internal';

export default function () {
  // 1. Login para obtener token
  const loginPayload = JSON.stringify({
    email: 'marianoya@admin.com',
    password: '123456',
  });

  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(
    `${BASE_URL}:3001/api/auth/login`,
    loginPayload,
    loginParams
  );

  const loginOk = check(loginRes, {
    'LOGIN status 200': (r) => r.status === 200,
    'LOGIN devuelve token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return !!body.token;
      } catch (e) {
        return false;
      }
    },
  });

  if (!loginOk) {
    console.log(`Error en login: status=${loginRes.status} body=${loginRes.body}`);
    sleep(1);
    return;
  }

  const token = JSON.parse(loginRes.body).token;

  // 2. Headers con JWT
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // 3. Probar endpoints protegidos
  const usersRes = http.get(`${BASE_URL}:3002/api/users`, authHeaders);
  check(usersRes, {
    'GET /users status 200': (r) => r.status === 200,
  });

  const projectsRes = http.get(`${BASE_URL}:3003/api/projects`, authHeaders);
  check(projectsRes, {
    'GET /projects status 200': (r) => r.status === 200,
  });

  const tasksRes = http.get(`${BASE_URL}:3004/api/tasks`, authHeaders);
  check(tasksRes, {
    'GET /tasks status 200': (r) => r.status === 200,
  });

  sleep(1);
}

