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
            frame: 'https://docs.google.com/document/d/e/2PACX-1vR6T_ooPWJrHbPmwgO1HxZQYMwdY4k4Hg-O0d8i6iMeZxgH2MB4xt7Hd1X9zA_qc_TZrsM6uv1GXTYZ/pub?embedded=true',
            url: 'https://docs.google.com/document/d/1KwgvG7XnMTQP6eUg-3_0pd9uNFfUnMdCrMTr9R4k6oc/view'
        },
        {
            name: 'Captain\'s Guide',
            frame: 'https://docs.google.com/document/d/e/2PACX-1vTVT-_GWyDlJ-lJV-Kp_H-aApe4WP0u9XeavtIwtR8cXI9eB41mNuBGMS8UqWW2xBEpgqMGfnbgWf4r/pub?embedded=true',
            url: 'https://docs.google.com/document/d/16TExICla2abU_6x82Kka5aSFk_qnmk4wEjTkakTwtxE/view'
        },
        {
            name: 'Team Management',
            frame: 'https://docs.google.com/document/d/e/2PACX-1vRtIn6_Ws1b_5VhWhrnPlXPrC8hDalv-cgtrXoIKHJwLRCiMoJipPh8i879AygAYSdCWYRpanJErw76/pub?embedded=true',
            url: 'https://docs.google.com/document/d/1_3HpkeHY-fchKlOTgw-c1gCrtMeiZRStTIAbaivqfEI/view'
        },
        {
            name: 'Match Result Guide',
            frame: 'https://docs.google.com/document/d/e/2PACX-1vQeHfvpLMr9d2CfMNmAMAjIrwDhPwPw8v8RengxrdumhQOJ0x_gR7mwkHA_0MEWnFwOb1sUa7z1jrux/pub?embedded=true',
            url: 'https://docs.google.com/document/d/1BO8igEzsgLPlMNiGZ85VNxY7Qvo5SxUheWdmJourX8Y/view'
        },
        {
            name: 'Caster Guide',
            frame: 'https://docs.google.com/document/d/e/2PACX-1vTs3ftna5Q5L95e6j91L45a8avx_M3e2h-5TDwci1xjX0I2JMUNY1OOG3KxBLG0wI9U1B93oVchRX_7/pub?embedded=true',
            url: 'https://docs.google.com/document/d/1rKBW7TsR-cnGn4XVngXuuzTY55AK-A98gSbQUcYEg40/view'
        },
        {
            name: 'Standards Board',
            frame: 'https://docs.google.com/document/d/e/2PACX-1vQrdT53HAKGZrpnqJ8IDUQzz6gc8v2isLkOWCu26TNStc4GHPnjY-4XBjxssW946CIuu_ippt7rpn8d/pub?embedded=true',
            url: 'https://docs.google.com/document/d/1hBchVpcNLEFgLQ4Mv3S-J2puAF3hc-2ts71n9swpeG8/view'
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
                            <Link href={doc.url} target="_blank">(📄)</Link>
                            <Link href="" onClick={e => updateIFrame(e, doc)}>{doc.name}</Link>
                            <br />
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-8">
                    {selectedDoc ? (
                        <iframe className="w-full shadow-md" src={selectedDoc.frame} style={iFrameStyle}></iframe>
                    ) : null}
                </div>
            </div>
        </Chrome>
    )
}

export default Help
