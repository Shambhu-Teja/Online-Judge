import { Problem } from './types';

export const MOCK_PROBLEMS: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    acceptanceRate: 49.5,
    likes: 54200,
    dislikes: 1800,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
                  You may assume that each input would have exactly one solution, and you may not use the same element twice.
                  You can return the answer in any order.`,
    examples: [
      {
        id: 1,
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        id: 2,
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ]
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    category: 'Linked List',
    acceptanceRate: 41.2,
    likes: 28400,
    dislikes: 5400,
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.`,
    examples: [
      {
        id: 1,
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      }
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.'
    ]
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'String',
    acceptanceRate: 34.1,
    likes: 36700,
    dislikes: 1600,
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ]
  },
  {
    id: '4',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    acceptanceRate: 37.8,
    likes: 25400,
    dislikes: 2800,
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.
                  The overall run time complexity should be O(log (m+n)).`,
    examples: [
      {
        id: 1,
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      }
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6'
    ]
  }
];
