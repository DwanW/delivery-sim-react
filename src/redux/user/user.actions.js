import UserActionTypes from './user.types';
import { addSnackBarAlert } from '../snackbar/snackbar.actions';

export const signInStart = () => ({
    type: UserActionTypes.SIGN_IN_START,
})

export const signInFailure = (error) => ({
    type: UserActionTypes.SIGN_IN_FAILURE,
    payload: error
})

export const signInSuccess = (currentUser) => ({
    type: UserActionTypes.SIGN_IN_SUCCESS,
    payload: currentUser
})

export const signUpStart = (userCredentials) => ({
    type: UserActionTypes.SIGN_UP_START,
    payload: userCredentials
})

export const signUpFailure = (error) => ({
    type: UserActionTypes.SIGN_UP_FAILURE,
    payload: error
})

export const signOut = () => ({
    type: UserActionTypes.SIGN_OUT
})

export const signInStartAsync = (username, password) => {
    return async dispatch => {
        dispatch(signInStart())

        let currentHeaders = new Headers();
        let encodeCred = btoa(`${username}:${password}`)
        currentHeaders.append("Authorization", "Basic " + encodeCred);

        let requestOptions = {
            method: 'GET',
            headers: currentHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/signin", requestOptions);
            if(response.status === 200){
                response.json().then(
                data => {
                    dispatch(signInSuccess({user: username, token: data["token"]}))
                })
            } else {
                dispatch(signInFailure("could not sign in"));
                dispatch(addSnackBarAlert("COULD NOT SIGN IN, PLEASE TRY AGAIN"))
            }
        } catch (error) {
            dispatch(signInFailure("could not sign in"));
            dispatch(addSnackBarAlert("COULD NOT SIGN IN, PLEASE TRY AGAIN"))
        }
    }
}

export const signUpStartAsync = (username, email, password) => {
    return async dispatch => {
        dispatch(signUpStart())

        let credentials = {username:username, email:email, password:password}

        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            redirect: 'follow',
            body: JSON.stringify(credentials)
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/signup", requestOptions);
            if(response.status === 200){
                dispatch(signInStartAsync(username, password))
            } else {
                dispatch(signUpFailure("sign up failed"));
                dispatch(addSnackBarAlert("COULD NOT SIGN UP, PLEASE TRY AGAIN"))
            }
        } catch (error) {
            dispatch(signUpFailure("could not sign up"));
            dispatch(addSnackBarAlert("COULD NOT SIGN UP, PLEASE TRY AGAIN"))
        }
    }
}

export const checkUserTokenAsync = (token) => {
    return async dispatch => {
        if(!token){
            console.log("not sign in yet")
            return;
        }

        let requestOptions = {
            method: 'GET',
            headers: {'x-access-token': token, 'Content-Type': 'application/json'},
            redirect: 'follow',
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/user", requestOptions);
            let respData = await response.json().then(data => data)
            console.log(respData)
            if(response.status !== 200){
                dispatch(signOut());
                dispatch(addSnackBarAlert("SESSION EXPIRED, PLEASE SIGN IN AGAIN"))
            }
        } catch (error) {
            dispatch(signOut());
            dispatch(addSnackBarAlert("PLEASE SIGN IN AGAIN"))
        }
    }
}

export const fetchInvoiceStart = () => ({
    type: UserActionTypes.FETCH_INVOICE_START,
})

export const fetchInvoiceFailure = (error) => ({
    type: UserActionTypes.FETCH_INVOICE_FAILURE,
    payload: error
})

export const fetchInvoiceSuccess = (invoices) => ({
    type: UserActionTypes.FETCH_INVOICE_SUCCESS,
    payload: invoices
})

export const fetchUserInvoiceStartAsync = (token) => {
    return async dispatch => {
        dispatch(fetchInvoiceStart())

        let requestOptions = {
            method: 'GET',
            headers: {'x-access-token': token, 'Content-Type': 'application/json'},
            redirect: 'follow',
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/userinvoice", requestOptions);
            let respData = await response.json().then(data => data)
            console.log(response.status)
            if(response.status === 200){
                dispatch(fetchInvoiceSuccess(respData));
            } else{
                throw new Error("need sign in");
            }
        } catch (error) {
            dispatch(fetchInvoiceFailure(error));
            dispatch(addSnackBarAlert("PLEASE SIGN IN"))
        }
    }
}