import React, { useState } from 'react';
import './Header.scss';
import { Tag } from 'antd';
import '../../node_modules/antd/dist/antd.css';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { CheckableTag } = Tag;
  const tagsData = ['Upcoming', 'Ongoing', 'Vesting', 'Completed'];
  const [selectedTags, setSelectedTags] = useState(['Upcoming']);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };
  return (
    <>
      <div className='header-container'>
        <div className='main-heading'>Welcome to the IVCO platform</div>
        <div className='box-container'>
          <input
            type='text'
            name='search'
            id='search'
            className='search-box'
            placeholder='search'
          />
          <Link to='/createivco'>
            <button className='create-ivco-btn btn'>Create IVCO</button>
          </Link>
        </div>
      </div>
      <div>
        <>
          <span
            style={{
              marginRight: 8,
              fontFamily: 'Wavehaus Sans',
            }}
          >
            Categories:
          </span>
          {tagsData.map((tag) => (
            <CheckableTag
              key={tag}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={(checked) => handleChange(tag, checked)}
              style={{
                border: '1px solid white',
              }}
            >
              <div
                style={{
                  fontFamily: 'Wavehaus Sans',
                  color: 'white',
                }}
              >
                {tag}
              </div>
            </CheckableTag>
          ))}
        </>
      </div>
    </>
  );
};
