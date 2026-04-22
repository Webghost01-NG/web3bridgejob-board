import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FiMapPin, FiClock, FiBriefcase, FiUsers } from 'react-icons/fi'
import { timeAgo } from '../utils/formatDate'

const Card = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
  transition: all 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(108, 71, 255, 0.15);
  }
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`

const CompanyInitial = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
`

const TypeBadge = styled.span`
  background: ${({ $type, theme }) =>
    $type === 'Full-time' ? theme.colors.primary + '22' :
    $type === 'Remote' ? theme.colors.secondary + '22' :
    theme.colors.warning + '22'};
  color: ${({ $type, theme }) =>
    $type === 'Full-time' ? theme.colors.primary :
    $type === 'Remote' ? theme.colors.secondary :
    theme.colors.warning};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.colors.text};
`

const Company = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  margin-bottom: 0.75rem;
`

const Meta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const JobCard = ({ job }) => (
  <Card to={`/jobs/${job.id}`}>
    <Top>
      <CompanyInitial>{job.company?.[0]?.toUpperCase()}</CompanyInitial>
      <TypeBadge $type={job.type}>{job.type}</TypeBadge>
    </Top>
    <Title>{job.title}</Title>
    <Company>{job.company}</Company>
    <Meta>
      <MetaItem><FiMapPin size={12} />{job.location}</MetaItem>
      <MetaItem><FiBriefcase size={12} />{job.role}</MetaItem>
      <MetaItem><FiUsers size={12} />{job.applicationsCount || 0} applicants</MetaItem>
      <MetaItem><FiClock size={12} />{timeAgo(job.createdAt)}</MetaItem>
    </Meta>
  </Card>
)

export default JobCard
