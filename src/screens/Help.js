import React, { useState } from 'react'
import Chrome from '../components/Chrome'
import { PageTitle } from '../components/elements'
import { Link } from '../components/elements'

function Help() {
    const [selectedDoc, setSelectedDoc] = useState({})

    const iFrameStyle = {
        height: '65vh',
    }

    const docs = [
        {
            name: 'League Rules',
            url: 'https://docs.google.com/document/d/e/2PACX-1vTs3ftna5Q5L95e6j91L45a8avx_M3e2h-5TDwci1xjX0I2JMUNY1OOG3KxBLG0wI9U1B93oVchRX_7/pub?embedded=true'
        },
        {
            name: 'Captain\'s Guide',
            url: 'https://docs.google.com/document/d/e/2PACX-1vTs3ftna5Q5L95e6j91L45a8avx_M3e2h-5TDwci1xjX0I2JMUNY1OOG3KxBLG0wI9U1B93oVchRX_7/pub?embedded=true'
        },
        {
            name: 'Create & Manage Team',
            url: 'https://docs.google.com/document/d/e/2PACX-1vRtIn6_Ws1b_5VhWhrnPlXPrC8hDalv-cgtrXoIKHJwLRCiMoJipPh8i879AygAYSdCWYRpanJErw76/pub?embedded=true'
        },
        {
            name: 'Match Result Submission',
            url: 'https://docs.google.com/document/d/e/2PACX-1vQeHfvpLMr9d2CfMNmAMAjIrwDhPwPw8v8RengxrdumhQOJ0x_gR7mwkHA_0MEWnFwOb1sUa7z1jrux/pub?embedded=true'
        },
        {
            name: 'Caster Guide',
            url: 'https://docs.google.com/document/d/e/2PACX-1vTs3ftna5Q5L95e6j91L45a8avx_M3e2h-5TDwci1xjX0I2JMUNY1OOG3KxBLG0wI9U1B93oVchRX_7/pub?embedded=true'
        }
    ]

    function updateIFrame(e, doc) {
        e.preventDefault()
        if (selectedDoc.name != doc.name) {
            setSelectedDoc(doc)
        } else {
            setSelectedDoc({})
        }
    }
    return (
        <Chrome>
            <PageTitle>Help Documentation</PageTitle>
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
                <div className="lg:col-span-2">
                    {docs.map(doc => (
                        <div>
                            <Link href="" onClick={e => updateIFrame(e, doc)}>{doc.name}</Link><br />
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-8">
                    {selectedDoc ? (
                        <iframe className="w-full" src={selectedDoc.url} style={iFrameStyle}></iframe>
                    ) : null}
                </div>
            </div>
        </Chrome>
    )
}

export default Help
