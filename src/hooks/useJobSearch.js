import { useState, useMemo } from 'react'

export const useJobSearch = (jobs) => {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.location?.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === 'All' || job.role === roleFilter
      const matchType = typeFilter === 'All' || job.type === typeFilter
      return matchSearch && matchRole && matchType
    })
  }, [jobs, search, roleFilter, typeFilter])

  return { search, setSearch, roleFilter, setRoleFilter, typeFilter, setTypeFilter, filtered }
}
