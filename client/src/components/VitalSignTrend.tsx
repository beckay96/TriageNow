import { FC } from 'react';
import { HealthMetrics } from '@/store';

interface VitalSignTrendProps {
  title: string;
  data: HealthMetrics[];
  metricType: 'heartRate' | 'bloodPressure' | 'bloodOxygen' | 'temperature';
  color: string;
  unit: string;
  normalRange?: {
    min: number;
    max: number;
  };
}

const VitalSignTrend: FC<VitalSignTrendProps> = ({ 
  title, 
  data, 
  metricType,
  color,
  unit,
  normalRange
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow">
        <h3 className="text-neutral-700 dark:text-white font-medium">{title}</h3>
        <div className="h-40 flex items-center justify-center">
          <p className="text-neutral-500 dark:text-neutral-400">No data available</p>
        </div>
      </div>
    );
  }

  // Extract the values based on the metric type
  const values = data.map(metric => {
    if (metricType === 'bloodPressure') {
      return metric.bloodPressure.systolic; // Just use systolic for the trend
    } else {
      return metric[metricType];
    }
  });

  // Calculate min and max for the Y-axis scale
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  
  // Add padding to min/max to make the chart more readable
  const padding = (maxValue - minValue) * 0.1;
  minValue = Math.max(0, minValue - padding);
  maxValue = maxValue + padding;

  // Adjust min/max to include normal range if provided
  if (normalRange) {
    minValue = Math.min(minValue, normalRange.min);
    maxValue = Math.max(maxValue, normalRange.max);
  }

  // Calculate the chart height
  const chartHeight = 120;
  const chartWidth = 300;

  // Generate points for the line
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * chartWidth;
    const y = chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  // Generate shaded area as a polygon
  const area = [
    ...points.split(' ').map(point => point),
    `${chartWidth},${chartHeight}`,
    `0,${chartHeight}`
  ].join(' ');

  // Generate normal range area if provided
  let normalRangeArea;
  if (normalRange) {
    const normalMinY = chartHeight - ((normalRange.min - minValue) / (maxValue - minValue)) * chartHeight;
    const normalMaxY = chartHeight - ((normalRange.max - minValue) / (maxValue - minValue)) * chartHeight;
    normalRangeArea = `0,${normalMinY} ${chartWidth},${normalMinY} ${chartWidth},${normalMaxY} 0,${normalMaxY}`;
  }

  // Generate labels for X axis (time points)
  const timeLabels = data.map((_, index) => {
    if (data.length <= 3) {
      return index;
    } else {
      // For more data points, show fewer labels
      return index % Math.ceil(data.length / 3) === 0 ? index : null;
    }
  });

  // Determine trend
  let trend = 'stable';
  if (values.length >= 2) {
    const first = values[0];
    const last = values[values.length - 1];
    const diff = last - first;
    const percentChange = Math.abs(diff / first) * 100;
    
    if (percentChange >= 5) {
      trend = diff > 0 ? 'increasing' : 'decreasing';
    }
  }

  // Get trend color
  const getTrendColor = () => {
    if (trend === 'stable') return 'text-blue-500';
    
    if (metricType === 'heartRate') {
      return trend === 'increasing' ? 'text-red-500' : 'text-green-500';
    } else if (metricType === 'bloodPressure') {
      return trend === 'increasing' ? 'text-red-500' : 'text-green-500';
    } else if (metricType === 'bloodOxygen') {
      return trend === 'decreasing' ? 'text-red-500' : 'text-green-500';
    } else { // temperature
      return trend === 'increasing' ? 'text-red-500' : 'text-green-500';
    }
  };

  // Get trend icon
  const getTrendIcon = () => {
    if (trend === 'stable') return 'trending_flat';
    return trend === 'increasing' ? 'trending_up' : 'trending_down';
  };

  // Most recent value
  const latestValue = values[values.length - 1];
  
  // For blood pressure, show both systolic and diastolic
  const displayValue = metricType === 'bloodPressure' 
    ? `${data[data.length - 1].bloodPressure.systolic}/${data[data.length - 1].bloodPressure.diastolic}`
    : latestValue;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-neutral-700 dark:text-white font-medium">{title}</h3>
        <div className={`flex items-center ${getTrendColor()}`}>
          <span className="material-icons text-sm mr-1">{getTrendIcon()}</span>
          <span className="text-xs">{trend === 'stable' ? 'Stable' : trend === 'increasing' ? 'Rising' : 'Falling'}</span>
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-2xl font-bold">{displayValue}</span>
        <span className="text-neutral-500 ml-1">{unit}</span>
      </div>

      <div className="relative h-[140px] w-full">
        <svg width="100%" height="140" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          {/* Normal range area if provided */}
          {normalRange && (
            <polygon 
              points={normalRangeArea}
              fill="rgba(0, 255, 0, 0.1)"
              className="dark:fill-zinc-700/20"
            />
          )}
          
          {/* Line chart area */}
          <polygon 
            points={area} 
            fill={`${color}20`} 
            className="dark:fill-opacity-30"
          />
          
          {/* Line chart */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {values.map((value, index) => {
            const x = (index / (values.length - 1)) * chartWidth;
            const y = chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="white"
                stroke={color}
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          {timeLabels.map((label, index) => (
            <div key={index} className={label === null ? 'invisible' : ''}>
              {label !== null && (
                <span>{data.length <= 3 ? `Reading ${label + 1}` : label + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VitalSignTrend;