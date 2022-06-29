import { useCollection } from '../../hooks/useCollection'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

//components
import ProjectList from '../../components/ProjectList'
import ProjectFilter from './ProjectFilter'

//styles
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuthContext()
  const { documents, error } = useCollection('projects')
  const [currentFilter, setCurrentFilter] = useState('all')

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  const projects = documents
    ? documents.filter((doc) => {
        switch (currentFilter) {
          case 'all':
            return true
          case 'mine':
            let assignedToMe = false
            doc.assignedUsersList.forEach((u) => {
              if (user.uid === u.id) {
                assignedToMe = true
              }
            })
            return assignedToMe
          case 'development':
          case 'design':
          case 'sales':
          case 'marketing':
            //console.log(doc.category, currentFilter)
            return doc.category === currentFilter
          default:
            return true
        }
      })
    : null

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && (
        <ProjectFilter
          currentFilter={currentFilter}
          changeFilter={changeFilter}
        />
      )}
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}
