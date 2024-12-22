import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { courseCategories } from '@/lib/utils';

const Toolbar = ({onSearch,onCategoryChange}:ToolbarProps) => {
    
      const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (value:string)=>{
        setSearchTerm(value)
        onSearch(value)
    }
  return (
    <div className='toolbar'>
        <input
            type="text"
            value={searchTerm}
            onChange={(e)=>handleSearch(e.target.value)}
            className='toolbar__search'
            placeholder='Search Courses'
        />
        <Select onValueChange={onCategoryChange}>
            <SelectTrigger>
                <SelectValue placeholder="Categories"/>
            </SelectTrigger>
            <SelectContent className='bg-customgreys-primarybg hover:bg-customgreys-primarybg'>
                <SelectItem value='all' className='toolbar__select-item'>
                    All Categories
                </SelectItem>
                {courseCategories.map((category)=>(
                       <SelectItem key={category.value } value={category.value } className='toolbar__select-item'>
                       {category.value }
                   </SelectItem>
                ))

                }
            </SelectContent>
        </Select>
    </div>
  )
}

export default Toolbar