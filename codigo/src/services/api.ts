import axios from 'axios';
import { v4 as uuid } from 'uuid';

import db from '../../data/db.json';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData extends SignInData {
  name: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3333'
})

const users = db.users;

export const usersApi = {
  signIn: ({ email, password }: SignInData) => {
    const user = users.find(user => user.email === email);

    if (user && user.password === password) {
      return {
        id: user.id,
        name: user.name
      }
    } else {
      throw new Error('Não foi possível efetuar o login. Verifique as credenciais.');
    }
  },
  signUp: ({ name, email, password }: SignUpData) => {
    users.forEach(user => {
      if (user.email === email) {
        throw new Error('Este e-mail já está sendo utilizado.');
      }
    });
    
    const user = {
      id: uuid(),
      name,
      email,
      password
    }

    users.push(user);

    api.post('users', user);

    return {
      id: user.id,
      name: user.name
    }
  }
}