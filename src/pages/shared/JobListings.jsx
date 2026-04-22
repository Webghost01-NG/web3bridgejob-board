import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchJobs } from '../../features/jobs/jobsSlice'
import { useJobSearch } from '../../hooks/useJobSearch'
import JobCard from '../../components/JobCard'
import Spinner from '../../components/Spinner'
import { FiSearch, FiFilter } from 'react-icons/fi'

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const Hero = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`

const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
  span { color: ${({ theme }) => theme.colors.primary}; }
`

const HeroSub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
`

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const SearchInput = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 0.9rem 1rem 0.9rem 3rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Filters = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  align-items: center;
`

const FilterLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`

const Select = styled.select`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.5rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  cursor: pointer;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Count = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  span { color: ${({ theme }) => theme.colors.primary}; font-weight: 600; }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textMuted};
  h3 { margin-bottom: 0.5rem; color: ${({ theme }) => theme.colors.text}; }
`

const ROLES = ['All', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'Design', 'Data']
const TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']

const JobListings = () => {
  const dispatch = useDispatch()
  const { jobs, loading } = useSelector((s) => s.jobs)
  const { search, setSearch, roleFilter, setRoleFilter, typeFilter, setTypeFilter, filtered } = useJobSearch(jobs)

  useEffect(() => { dispatch(fetchJobs()) }, [dispatch])

  return (
    <Page>
      <Hero>
        <HeroTitle>Find Your Next <span>Dev Role</span></HeroTitle>
        <HeroSub>Jobs for bootcamp grads, self-taught devs & Web3Bridge alumni</HeroSub>
      </Hero>
      <SearchBar>
        <FiSearch size={18} />
        <SearchInput
          placeholder="Search by title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>
      <Filters>
        <FilterLabel><FiFilter size={14} /> Filter:</FilterLabel>
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </Select>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </Select>
      </Filters>
      {loading ? <Spinner /> : (
        <>
          <Count><span>{filtered.length}</span> jobs found</Count>
          {filtered.length === 0 ? (
            <Empty><h3>No jobs found</h3><p>Try adjusting your search or filters</p></Empty>
          ) : (
            <Grid>{filtered.map(job => <JobCard key={job.id} job={job} />)}</Grid>
          )}
        </>
      )}
    </Page>
  )
}

export default JobListings
