import React from 'react'
import {H3} from './elements'
import orderBy from "lodash.orderby";

function AwardsTable({awards, className = ''}) {
  if (!awards || awards.length == 0) {
    return null
  }

  const sortedAwards = orderBy(awards, [item => item.round.season, item => item.round.round_number], ['desc', 'desc'])

  return (
    <div>
      <H3>Awards</H3>
      <div style={{gridTemplateRows: `repeat(${sortedAwards.length}, 50px)`}}
           className={`${className} grid md:grid-cols-2 gap-4 mb-4 md:mb-0"`}>
        {sortedAwards
          .map((award) => {
            return (
              <div>
                <div className='uppercase break-all font-head font-lg'>{award.award_category.name}</div>
                {award.group
                  ? (
                    <div className='text-xs'>
                      {award.round.name} - {award.group.name}
                    </div>
                  ) : (

                    <div className='text-xs'>
                      {award.round.name}
                    </div>
                  )
                }
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default AwardsTable
