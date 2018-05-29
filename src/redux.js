// @flow
import * as redux from 'redux'
import { EditorState } from 'draft-js'

let count = Math.round((window.innerHeight - 230) / 50)

type state = {
  editorState: EditorState,
  hydrated: bool,
  //selectedPost: any,
  selectedProject: any
}

type action = {
  type: string,
  payload: any
}

const initialState : state = {
  editorState: EditorState.createEmpty(),
  hydrated: false,
  //selectedProject: undefined,
  selectedPost: undefined
}

export const SET_EDITOR_STATE = 'SET_EDITOR_STATE'
export const SELECT_PROJECT = 'SELECT_PROJECT'
export const SELECT_POST = 'SELECT_POST'

export const reducer = (state: state, action: action) => {
  switch (action.type) {
    case SET_EDITOR_STATE:
      return { ...state, ...action.payload }
    case SELECT_POST:
      return { ...state, ...action.payload }
    case SELECT_PROJECT:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const setEditorState = (editorState: EditorState) => ({
  payload: {
    editorState,
    hydrated: true
  },
  type: SET_EDITOR_STATE
})

export const selectProject = (selectedProject: string) => ({
  payload: {
    selectedProject
  },
  type: SELECT_PROJECT
})

//export const selectPost = (selectedPost: { id: string }) => ({
//  payload: {
//    selectedPost
//  },
//  type: SELECT_POST
//})

export const store = redux.createStore(reducer, initialState)
