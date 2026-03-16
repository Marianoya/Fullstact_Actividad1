import http from 'k6/http';
import { check, sleep } from 'k6';

const token = 'PEGA_AQUI_TU_TOKEN';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const resProjects = http.get('http://host.docker.internal:3003/api/projects', params);
  check(resProjects, {
    'GET /projects status 200': (r) => r.status === 200,
  });

  const resUsers = http.get('http://host.docker.internal:3002/api/users', params);
  check(resUsers, {
    'GET /users status 200': (r) => r.status === 200,
  });

  const resTasks = http.get('http://host.docker.internal:3004/api/tasks', params);
  check(resTasks, {
    'GET /tasks status 200': (r) => r.status === 200,
  });

  sleep(1);
}

