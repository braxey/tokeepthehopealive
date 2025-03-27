import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 10h12M12 4v16M8 16c0 2.5 2 4.5 4 4.5s4-2 4-4.5c-1 0-2-1-2-2.5s1-2.5 2-2.5"
            />
        </svg>
    );
}
