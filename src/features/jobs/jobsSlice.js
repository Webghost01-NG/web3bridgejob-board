import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (_, thunkAPI) => {
  try {
    const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const fetchCompanyJobs = createAsyncThunk('jobs/fetchCompany', async (uid, thunkAPI) => {
  try {
    const q = query(collection(db, 'jobs'), where('companyUid', '==', uid), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const postJob = createAsyncThunk('jobs/post', async (jobData, thunkAPI) => {
  try {
    const docRef = await addDoc(collection(db, 'jobs'), {
      ...jobData,
      createdAt: serverTimestamp(),
      applicationsCount: 0,
    })
    return { id: docRef.id, ...jobData, applicationsCount: 0 }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const updateJob = createAsyncThunk('jobs/update', async ({ id, data }, thunkAPI) => {
  try {
    await updateDoc(doc(db, 'jobs', id), data)
    return { id, data }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const deleteJob = createAsyncThunk('jobs/delete', async (id, thunkAPI) => {
  try {
    await deleteDoc(doc(db, 'jobs', id))
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: { jobs: [], companyJobs: [], loading: false, error: null },
  reducers: {
    clearJobError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.loading = false; state.jobs = action.payload })
      .addCase(fetchJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchCompanyJobs.fulfilled, (state, action) => { state.companyJobs = action.payload })
      .addCase(postJob.fulfilled, (state, action) => { state.companyJobs.unshift(action.payload) })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.companyJobs.findIndex(j => j.id === action.payload.id)
        if (idx !== -1) state.companyJobs[idx] = { ...state.companyJobs[idx], ...action.payload.data }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.companyJobs = state.companyJobs.filter(j => j.id !== action.payload)
      })
  },
})

export const { clearJobError } = jobsSlice.actions
export default jobsSlice.reducer
