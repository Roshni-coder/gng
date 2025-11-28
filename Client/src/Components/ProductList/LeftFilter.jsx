import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Collapse } from 'react-collapse';
import { Checkbox, FormControlLabel, Slider, Button } from '@mui/material';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

function LeftFilter({ onApplyFilters }) {
  const [isOpenCatFilter, setIsOpenCatFilter] = useState(true);
  const [isOpenPriceFilter, setIsOpenPriceFilter] = useState(true);
  const [isOpenDiscountFilter, setIsOpenDiscountFilter] = useState(true);
  const [category, setCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/getcategories`
        );
        setCategory(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategory();
  }, []);

  const handleApply = () => {
    onApplyFilters({
      selectedCategories,
      selectedDiscount,
      priceRange,
      sort
    });
    setShowFilters(false);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleDiscountChange = (val) => {
    setSelectedDiscount(prev => (prev === val ? null : val));
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="block lg:hidden px-4 py-2">
        <button
          className="text-white px-4 py-2 rounded w-full"
          style={{ backgroundColor: '#7d0492' }}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside
        className={`sidebar px-4 py-4 space-y-4 bg-white border rounded-md shadow-sm 
        ${showFilters ? 'block' : 'hidden'} lg:block w-full sm:max-w-sm lg:max-w-full`}
      >
        {/* Category Filter */}
        <div className="box w-full">
          <h3 className="text-base flex justify-between items-center font-semibold">
            <span className="text-sm md:text-base">Shop by Category</span>
            <Button
              className="!min-w-0 !p-1 !text-[#7d0492] md:!p-2"
              onClick={() => setIsOpenCatFilter(!isOpenCatFilter)}
            >
              {isOpenCatFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>

          <Collapse isOpened={isOpenCatFilter}>
            <div className="py-2 flex flex-col gap-1 text-sm">
              {category.map((cat, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategoryChange(cat._id)}
                    />
                  }
                  label={cat.categoryname}
                />
              ))}
            </div>
          </Collapse>
        </div>

        {/* Price Filter */}
        <div className="box w-full">
          <h3 className="text-base flex justify-between items-center font-semibold">
            <span className="text-sm md:text-base">Price</span>
            <Button
              className="!min-w-0 !p-1 md:!p-2 !text-[#7d0492]"
              onClick={() => setIsOpenPriceFilter(!isOpenPriceFilter)}
            >
              {isOpenPriceFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>

          <Collapse isOpened={isOpenPriceFilter}>
            <div className="w-full">
              <div className="py-2">
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  sx={{
                    color: '#7d0492',
                    '& .MuiSlider-thumb': {
                      '&:hover, &.Mui-focusVisible, &.Mui-active': {
                        boxShadow: '0px 0px 0px 8px rgba(125, 4, 146, 0.16)',
                      },
                    },
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 px-1">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </Collapse>
        </div>

        {/* Discount Filter */}
        <div className="box w-full">
          <h3 className="text-base flex justify-between items-center font-semibold">
            <span className="text-sm md:text-base">Discount</span>
            <Button
              className="!min-w-0 !p-1 md:!p-2 !text-[#7d0492]"
              onClick={() => setIsOpenDiscountFilter(!isOpenDiscountFilter)}
            >
              {isOpenDiscountFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>

          <Collapse isOpened={isOpenDiscountFilter}>
            <div className="py-2 flex flex-col gap-1 text-sm">
              {[10, 20, 30, 40, 50].map((discount, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedDiscount === discount}
                      onChange={() => handleDiscountChange(discount)}
                    />
                  }
                  label={`${discount}% or more`}
                />
              ))}
            </div>
          </Collapse>
        </div>

        {/* Apply Button */}
        <div className="text-center mt-4">
          <Button
            style={{ backgroundColor: '#7d0492' }}
            variant="contained"
            fullWidth
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </aside>
    </>
  );
}

export default LeftFilter;
