import { useState } from 'react';

import LinkItem from './LinkItem';
import { locale } from '../../utils/viewData';

export default function LinkList(props) {

    const { links } = props;

    const renderLinks = () => {
        let count = 0;
        let l = [];
        links.map((link) => {
            if (link.type == 'final' && link.format == 'link') {
                l.push(<LinkItem link={link} key={link.id} />);
                count++;
            }
        });
        if (count > 0) {
            return (
                <>
                    <label className="fw-bolder">{locale.FINAL_LINKS}</label>
                    <div className="list-group">
                        {l}
                    </div>
                </>
            )
        }

        return '';
    };

    return renderLinks();
}