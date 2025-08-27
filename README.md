# US Counties Healthcare Analysis

A data analysis project exploring healthcare access patterns across US counties, with an interactive web dashboard for visualization.

## What's in here

- `DataPrep.ipynb` - Data cleaning and preprocessing
- `explore.ipynb` - Exploratory data analysis
- `Analysis.ipynb` - Main analysis with ML models
- `results/` - Interactive web dashboard (yeah, I put the frontend in results folder, sue me)
    - https://jeryjs.github.io/US-Counties-Healthcare-Analysis/

## Quick Start

### Analysis (Jupyter Notebooks)
```bash
# Install requirements
pip install pandas numpy matplotlib seaborn plotly scikit-learn

# Run notebooks in order
jupyter notebook DataPrep.ipynb
jupyter notebook explore.ipynb
jupyter notebook Analysis.ipynb
```

### Web Dashboard
```bash
cd results
npm install
npm run dev
```

## Data Sources

- County Health Rankings & Roadmaps
- US Census Bureau
- CDC health indicators
- Various socioeconomic datasets

## Tech Stack

- **Python**: pandas, numpy, scikit-learn, matplotlib, seaborn, plotly
- **Frontend**: React, Vite, Leaflet, Tailwind CSS
- **AI**: Groq Llama API for recommendations

## Key Findings

- Healthcare access varies significantly by region and socioeconomic factors
- Rural counties face unique challenges
- Insurance coverage and income are strong predictors of healthcare access
- Some counties show unexpected patterns that warrant further investigation

## Project Structure

```
├── DataPrep.ipynb          # Data cleaning and preprocessing
├── explore.ipynb           # Exploratory data analysis
├── Analysis.ipynb          # ML models and statistical analysis
├── results/                # Web dashboard
│   ├── src/
│   ├── public/             # Data files
│   └── package.json
└── README.md
```

## Notes

- The web dashboard includes AI-powered recommendations (optional)
- All analysis is reproducible from the notebooks
- Data files are included for convenience

## License

MIT