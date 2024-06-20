import React, { useState } from 'react'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { SectionBody } from 'components/Sections/SectionView'
import { SectionHeader } from 'components/Sections/SectionHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useSections } from './SectionsContext'

const SectionDialog = (): JSX.Element | null => {
  const [menuState, setMenuState] = useState(false)
  const anchorRef = React.useRef(null)
  const toggleMenu = (): void => setMenuState(!menuState)
  const { konnectorsByCategory, groupedSections } = useSections()
  const { category, type } = useParams()
  const navigate = useNavigate()

  const section =
    type === 'konnectors'
      ? konnectorsByCategory?.find(section => section.id === category)
      : type === 'shortcuts'
      ? groupedSections?.find(section => section.id === category)
      : null

  const handleGoBack = (): void => navigate(-1)

  if (!section) return null

  return (
    <CozyTheme variant="normal">
      <Dialog
        content={<SectionBody section={section} />}
        fullScreen={false}
        open
        size="large"
        title={
          <SectionHeader
            section={section}
            anchorRef={anchorRef}
            toggleMenu={toggleMenu}
            menuState={menuState}
          />
        }
        onClose={handleGoBack}
      />
    </CozyTheme>
  )
}

export default SectionDialog
