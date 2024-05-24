import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/aside/sidebar'
import MobileSidebar from '@/components/aside/mobileNavbar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { StoryFilter } from '@/types'
import Image from 'next/image'
import styles from '@/styles/index.module.css'
import Footer from '@/components/footer/footer'
import { Tooltip, Badge } from '@nextui-org/react'
import { logoutFunction } from '@/components/logout'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getSession } from '@/session'
import Link from 'next/link'
import ExpandButton from '@/components/buttons/expandButton'
import Aside from '@/components/aside/aside'


/**
 * The minimum and maximum year that can be selected in the year slider in ../components/sidebar.tsx
 * These values are also used at other points to check if the sliders are at their default values
 */
export const yearLimitsStories = {
  min: 2014,
  max: new Date().getFullYear(),
}

export default function HomePage() {
  return (
    <>
      <h1>Hello world</h1>
    </>
  )
}