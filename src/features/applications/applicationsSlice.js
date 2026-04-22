import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

export const applyToJob = createAsyncThunk('applications/apply', async (appData, thunkAPI) => {
  try {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...appData,
      status: 'pending',
      appliedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...appData, status: 'pending' }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const fetchMyApplications = createAsyncThunk('applications/fetchMine', async (uid, thunkAPI) => {
  try {
    const q = query(collection(db, 'applications'), where('candidateUid', '==', uid), orderBy('appliedAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const fetchJobApplications = createAsyncThunk('applications/fetchForJob', async (jobId, thunkAPI) => {
  try {
    const q = query(collection(db, 'applications'), where('jobId', '==', jobId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    await updateDoc(doc(db, 'applications', id), { status })
    return { id, status }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: { myApplications: [], jobApplications: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(applyToJob.fulfilled, (state, action) => { state.myApplications.unshift(action.payload) })
      .addCase(fetchMyApplications.pending, (state) => { state.loading = true })
      .addCase(fetchMyApplications.fulfilled, (state, action) => { state.loading = false; state.myApplications = action.payload })
      .addCase(fetchMyApplications.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchJobApplications.fulfilled, (state, action) => { state.jobApplications = action.payload })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const app = state.jobApplications.find(a => a.id === action.payload.id)
        if (app) app.status = action.payload.status
      })
  },
})

export default applicationsSlice.reducer
