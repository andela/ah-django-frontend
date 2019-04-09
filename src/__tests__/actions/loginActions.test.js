import {
  inputHandler,
  validationResponse,
  submitLoginForm,
  clearLogin,
  validateCredentials,
} from '../../redux/actions/loginActions';
import {
  LOGIN_FAILURE,
  HANDLE_LOGIN_INPUT,
  INPUT_VALIDATION_FAILURE,
  INPUT_VALIDATION_SUCCESS,
  CLEAR_LOGIN,
  SUBMIT_LOGIN_FORM,
} from '../../redux/actions-types/loginTypes';
import store from '../../redux/store';

describe('Login Actions', () => {
  test('should return filed and its value', () => {
    const data1 = {
      field: 'username',
      value: 'John',
    };
    const data2 = {
      field: 'password',
      value: '123456',
    };
    const res1 = inputHandler(data1);
    const res2 = inputHandler(data2);
    expect(res1.type).toEqual(HANDLE_LOGIN_INPUT);
    expect(res1.payload.field).toEqual(data1.field);
    expect(res1.payload.value).toEqual(data1.value);
    expect(res2.type).toEqual(HANDLE_LOGIN_INPUT);
    expect(res2.payload.field).toEqual(data2.field);
    expect(res2.payload.value).toEqual(data2.value);
  });

  test('should return provide payload and type = INPUT_VALIDATION_FAILURE', () => {
    const payload = {
      response: {
        message: 'Password and username must be at least 6 characters',
      },
    };
    const res = validationResponse(payload);
    expect(res.type).toEqual(INPUT_VALIDATION_FAILURE);
    expect(res.payload).toEqual(payload);
  });

  test('should return provide payload and type as provide', () => {
    const payload = {
      response: {
        message: 'Password and username must be at least 6 characters',
      },
    };
    const res = validationResponse(payload, INPUT_VALIDATION_SUCCESS);
    expect(res.type).toEqual(INPUT_VALIDATION_SUCCESS);
    expect(res.payload).toEqual(payload);
  });

  test('should return CLEAR_LOGIN TYPE', () => {
    const res = clearLogin();
    expect(res.type).toEqual(CLEAR_LOGIN);
  });

  test('should return SUBMIT_LOGIN_FORM TYPE', () => {
    const res = submitLoginForm();
    expect(res.type).toEqual(SUBMIT_LOGIN_FORM);
  });

  test('should return validation failure for password and email', () => {
    const credentials = {
      username: 'ton',
      password: '123',
    };
    const payload = {
      response: {
        message: 'Password and username must be at least 6 characters',
      },
    };
    return validateCredentials(credentials)(store.dispatch).then((res) => {
      expect(res).toEqual(payload.response);
    });
  });

  test('should return validation failure for password', () => {
    const credentials = {
      username: 'daniel',
      password: '123',
    };
    const payload = {
      response: {
        message: 'Password must be at least 6 characters',
      },
    };
    return validateCredentials(credentials)(store.dispatch).then((res) => {
      expect(res).toEqual(payload.response);
    });
  });

  test('should return validation failure for username', () => {
    const credentials = {
      username: 'dan',
      password: '123456',
    };
    const payload = {
      response: {
        message: 'Username must be at least 6 characters',
      },
    };
    return validateCredentials(credentials)(store.dispatch).then((res) => {
      expect(res).toEqual(payload.response);
    });
  });

  test('should return not validation failure', () => {
    const credentials = {
      username: 'daniel',
      password: '123456',
    };
    const payload = {
      response: {
        message: 'Ok',
      },
    };
    return validateCredentials(credentials)(store.dispatch).then((res) => {
      expect(res).toEqual(payload.response);
    });
  });
});
